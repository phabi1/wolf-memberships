<?php
/**
 * PHP file to use when rendering the block type on the server to show on the front end.
 *
 * The following variables are exposed to the file:
 *     $attributes (array): The block attributes.
 *     $content (string): The block default content.
 *     $block (WP_Block): The block instance.
 *
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */
?>

<?php

$requestId = absint($_GET['request_id'] ?? 0);
$token = sanitize_text_field($_GET['token'] ?? '');

$entityManager = \Wolf\Core\Plugin::getContainer()->get('wolf.entity.manager');

$campaignRepository = $entityManager->getRepository('wolf-memberships.campaign');
$requestRepository = $entityManager->getRepository('wolf-memberships.request');

$request = $requestRepository->findById($requestId);

if (!$request || $request->token !== $token) {
	echo '<p>' . esc_html__('Invalid request or token.', 'wolf-membership') . '</p>';
	return;
}


if ($request->status !== 'approved') {
	echo '<p>' . esc_html__('This request is not approved yet.', 'wolf-membership') . '</p>';
	return;
}

$campaign = $campaignRepository->findById($request->campaign_id);

$useCaseBus = \Wolf\Core\Plugin::getContainer()->get('wolf.use_case_bus');

$paymentMethods = [
	['name' => 'Credit Card', 'value' => 'credit_card'],
	['name' => 'Credit Card x3', 'value' => 'credit_card_x3'],
	['name' => 'Bank Transfer', 'value' => 'bank_transfer'],
	['name' => 'Check', 'value' => 'check'],
];

if (isset($_GET['payment_method']) && !empty($_GET['payment_method'])) {

	$paymentMethod = sanitize_text_field($_GET['payment_method']);

	$pay = $useCaseBus->execute('wolf-memberships.calculate_registration_total', [
		'campaign_id' => $campaign->id,
		'participants' => $request->data->participants ?? [],
	]);


	if (!in_array($paymentMethod, array_column($paymentMethods, 'value'))) {
		echo '<p>' . esc_html__('Invalid payment method.', 'wolf-membership') . '</p>';
		return;
	}

	if ($paymentMethod === 'credit_card') {
		$amount = (int) $pay['total_amount'];
		$amount = 3000;

		$paymentMethod = sanitize_text_field($_GET['payment_method']);
		$res = $useCaseBus->execute('wolf-billing.create_payment', [
			'amount' => $amount,
			'currency' => 'EUR',
			'payment_method' => 'multiplehelloasso',
			'name' => 'Inscription à l\'événement ' . $campaign->title,
			'payer' => [
				'first_name' => $request->firstname,
				'last_name' => $request->lastname,
				'email' => $request->email
			],
			'metadata' => ['external_id' => 'request:' . $request->id]
		]);
	} elseif ($paymentMethod === 'credit_card_x3') {

		$periods = 3;
		$total_amount = (int) $pay['total_amount'];

		$fees = 0;
		$discount = 0;
		$amount = 0;
		foreach ($pay['items'] as $item) {
			if ($item['type'] === 'fee') {
				$fees += (int) $item['amount'];
			} elseif ($item['type'] === 'discount') {
				$amount -= (int) $item['amount'];
			} else {
				$amount += (int) $item['amount'];
			}
		}

		$baseAmount = floor($amount / $periods);

		$terms = [];
		$terms[] = [
			'amount' => $baseAmount + $fees,
			'date' => strtotime('+0 month'),
		];
		$amount -= $baseAmount;

		for ($i = 1; $i < $periods; $i++) {
			$terms[] = [
				'amount' => $baseAmount,
				'date' => strtotime('+' . $i . ' month'),
			];

			$amount -= $baseAmount;
		}

		// Regularize the last term to account for any rounding differences
		if ($amount > 0) {
			$terms[count($terms) - 1]['amount'] += $amount;
		}

		$paymentMethod = sanitize_text_field($_GET['payment_method']);
		$res = $useCaseBus->execute('wolf-billing.create_payment', [
			'amount' => $total_amount,
			'currency' => 'EUR',
			'payment_method' => 'multiplehelloasso',
			'name' => 'Inscription à l\'événement ' . $campaign->title,
			'payer' => [
				'first_name' => $request->firstname,
				'last_name' => $request->lastname,
				'email' => $request->email
			],
			'items' => $terms,
			'metadata' => ['external_id' => 'request:' . $request->id]
		]);
	} elseif ($paymentMethod === 'bank_transfer') {
		$amount = (int) $pay['total_amount'];
		$res = $useCaseBus->execute('wolf-billing.create_payment', [
			'amount' => $amount,
			'currency' => 'EUR',
			'payment_method' => 'bank_transfer',
			'name' => 'Inscription à l\'événement ' . $campaign->title,
			'payer' => [
				'first_name' => $request->firstname,
				'last_name' => $request->lastname,
				'email' => $request->email
			],
			'metadata' => ['external_id' => 'request:' . $request->id]
		]);
	} elseif ($paymentMethod === 'check') {
		$amount = (int) $pay['total_amount'];
		$res = $useCaseBus->execute('wolf-billing.create_payment', [
			'amount' => $amount,
			'currency' => 'EUR',
			'payment_method' => 'check',
			'name' => 'Inscription à l\'événement ' . $campaign->title,
			'payer' => [
				'first_name' => $request->firstname,
				'last_name' => $request->lastname,
				'email' => $request->email
			],
			'metadata' => ['external_id' => 'request:' . $request->id]
		]);
	} else {
		echo '<p>' . esc_html__('Invalid payment method.', 'wolf-membership') . '</p>';
		return;
	}

	if (is_string($res['redirect_url'] ?? '')) {
		wp_redirect($res['redirect_url']);
		exit;
	} else {
		echo '<p>' . esc_html__('Failed to generate payment URL.', 'wolf-membership') . '</p>';
		return;
	}
}




$pageUrl = get_permalink(get_option('wolf_membership_pay_page', 0));

?>


<div <?php echo get_block_wrapper_attributes(); ?>>
	<p>
		<?php echo esc_html__('Please select a payment method to complete your registration:', 'wolf-membership'); ?>
	</p>
	<?php
	foreach ($paymentMethods as $method) {
		?>
		<div>
			<a href="<?php echo esc_url(add_query_arg([
				'request_id' => $requestId,
				'token' => $token,
				'payment_method' => $method['value'],
			], $pageUrl)); ?>">
				<?php echo esc_html($method['name']); ?>
			</a>
		</div>
		<?php
	}
	?>
</div>