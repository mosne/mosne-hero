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
import { VideoPanel } from './components/video-panel';

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
 * Register block variation for core/cover with mobile video support.
 */
registerBlockVariation( 'core/cover', {
	name: 'mosne-hero-video',
	title: __( 'Hero Video (Mobile & Desktop)', 'mosne-hero' ),
	description: __(
		'Cover block with separate mobile and desktop background videos and focal points.',
		'mosne-hero'
	),
	attributes: {
		variation: 'mosne-hero-video',
		backgroundType: 'video',
	},
	isDefault: false,
	scope: [ 'inserter', 'transform' ],
} );

/**
 * Extend core/cover block with mobile image and video controls.
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

		// Check if this block uses our variations
		const isCoverVariation = attributes.variation === 'mosne-hero-cover';
		const isVideoVariation = attributes.variation === 'mosne-hero-video';

		// Show panel only if variation attribute is set
		if ( ! isCoverVariation && ! isVideoVariation ) {
			return <BlockEdit { ...props } />;
		}

		return (
			<>
				<BlockEdit { ...props } />
				{ isCoverVariation && (
					<MobileImagePanel
						attributes={ attributes }
						setAttributes={ props.setAttributes }
					/>
				) }
				{ isVideoVariation && (
					<VideoPanel
						attributes={ attributes }
						setAttributes={ props.setAttributes }
					/>
				) }
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
