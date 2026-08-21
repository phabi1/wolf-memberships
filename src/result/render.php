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
$type = $_GET['type'] ?? '';
$checkoutId = absint($_GET['checkout_id'] ?? 0);
$token = sanitize_text_field($_GET['token'] ?? '');

$useCaseBus = \Wolf\Core\Plugin::getContainer()->get('wolf.use_case_bus');
$result = $useCaseBus->execute('wolf-events.get_checkout_result', [
	'type' => $type,
	'checkout_id' => $checkoutId,
	'token' => $token,
]);

?>

<p <?php echo get_block_wrapper_attributes(); ?>>
	<?php
	if ($result['valid'] ?? false) {
		esc_html_e('Payment processed successfully!', 'result');
	} else {
		esc_html_e('Invalid payment result parameters.', 'result');
	}
	?>
</p>