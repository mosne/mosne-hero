/**
 * Registers the block variation and extends core/cover block.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-variations/
 * @package
 */

import { registerBlockVariation } from '@wordpress/blocks';
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { __ } from '@wordpress/i18n';

import { MobileImagePanel } from './components/mobile-image-panel';

/**
 * Register block variation for core/cover with mobile image support.
 */
registerBlockVariation( 'core/cover', {
	name: 'mosne-hero-cover',
	title: __( 'Hero Cover (Mobile & Desktop)', 'mosne-hero' ),
	description: __(
		'Cover block with separate mobile and desktop background images and sizes.',
		'mosne-hero'
	),
	attributes: {
		variation: 'mosne-hero-cover',
	},
	isDefault: false,
	scope: [ 'inserter', 'transform' ],
} );

/**
 * Extend core/cover block with mobile image controls.
 */
const withMobileImageControls = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		const { name, attributes } = props;

		// Ensure BlockEdit is valid
		if ( ! BlockEdit || typeof BlockEdit !== 'function' ) {
			return null;
		}

		// Only apply to core/cover blocks
		if ( name !== 'core/cover' ) {
			return <BlockEdit { ...props } />;
		}

		// Check if this block uses our variation
		const hasVariationAttr = attributes.variation === 'mosne-hero-cover';

		// Show panel only if variation attribute is set
		if ( ! hasVariationAttr ) {
			return <BlockEdit { ...props } />;
		}

		return (
			<>
				<BlockEdit { ...props } />
				<MobileImagePanel
					attributes={ attributes }
					setAttributes={ props.setAttributes }
				/>
			</>
		);
	};
}, 'withMobileImageControls' );

addFilter(
	'editor.BlockEdit',
	'mosne-hero/cover-with-mobile-image',
	withMobileImageControls,
	20 // Higher priority to ensure it runs
);
