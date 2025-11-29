/**
 * Use this file for JavaScript code that you want to run in the front-end
 * on posts/pages that contain this block.
 *
 * When this file is defined as the value of the `viewScript` property
 * in `block.json` it will be enqueued on the front end of the site.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/#view-script
 */

/**
 * Initialize hero block functionality.
 */
(function() {
	'use strict';

	/**
	 * Initialize all hero blocks on the page.
	 */
	function initHeroBlocks() {
		const heroBlocks = document.querySelectorAll( '.wp-block-create-block-mosne-hero' );

		if ( ! heroBlocks.length ) {
			return;
		}

		heroBlocks.forEach( ( block ) => {
			// Add any frontend functionality here if needed
			// For example: lazy loading, parallax effects, etc.
		} );
	}

	// Initialize when DOM is ready
	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', initHeroBlocks );
	} else {
		initHeroBlocks();
	}
})();
