import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { campaignId } = attributes;

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Paramètres', 'wolf-membership' ) }>
					<TextControl
						label={ __( "ID de la campagne", 'wolf-membership' ) }
						value={ campaignId ?? '' }
						type="number"
						onChange={ ( value ) =>
							setAttributes( {
								campaignId: value ? parseInt( value, 10 ) : null,
							} )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				{ campaignId ? (
					<p>
						{ __(
							"Formulaire d'inscription — Campagne #",
							'wolf-membership'
						) }
						{ campaignId }
					</p>
				) : (
					<p>
						{ __(
							"Veuillez sélectionner une campagne dans le panneau latéral.",
							'wolf-membership'
						) }
					</p>
				) }
			</div>
		</>
	);
}
