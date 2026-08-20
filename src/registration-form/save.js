import { useBlockProps } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { campaignId } = attributes;

	return (
		<div
			{ ...useBlockProps.save() }
			data-campaign-id={ campaignId }
		/>
	);
}
