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

use Wolf\Core\Plugin;

$container = Plugin::getContainer();

$labels = [
	1 => 'Lundi',
	2 => 'Mardi',
	3 => 'Mercredi',
	4 => 'Jeudi',
	5 => 'Vendredi',
	6 => 'Samedi',
	7 => 'Dimanche',
];

$lessonRepository = $container->get('wolf.entity.manager')->getRepository('wolf-memberships.lesson');

$lessons = $lessonRepository->find(['campaign_id' => ['eq' => 1]]);

$days = [];
foreach ($lessons as $lesson) {
	$days[$lesson->day][] = [
		'title' => $lesson->title,
		'lesson_start' => date('H:i', $lesson->lesson_start),
		'lesson_end' => date('H:i', $lesson->lesson_end),
	];
}

ksort($days);
?>


<div <?php echo get_block_wrapper_attributes(); ?>>
	<div class="scheduler-days">
		<?php
		foreach ($days as $day => $lessonsDay) {
			?>
			<div class="scheduler-day day-<?= $day; ?>">
				<div class="scheduler-day-title"><?= $labels[$day]; ?> </div>
				<div class="scheduler-day-lessons">
					<?php
					foreach ($lessonsDay as $lesson) {
						?>
						<div class="scheduler-lesson-title"><?= $lesson['title']; ?> </div>
						<div class="scheduler-lesson-time"><?= $lesson['lesson_start']; ?> - <?= $lesson['lesson_end']; ?> </div>
						<?php
					}
					?>
				</div>
			</div>
			<?php
		}
		?>
	</div>
</div>