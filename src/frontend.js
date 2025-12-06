/**
 * Frontend script to handle focal point switching based on media queries.
 *
 * @package MosneHero
 */

(function () {
	'use strict';

	/**
	 * Initialize focal point switching for hero cover blocks.
	 */
	function initFocalPointSwitching() {
		// Find all picture elements with mobile image support
		const pictureElements = document.querySelectorAll(
			'.has-mobile-image picture.wp-block-cover__image-background'
		);

		if (!pictureElements.length) {
			return;
		}

		pictureElements.forEach((picture) => {
			const img = picture.querySelector('img');
			if (!img) {
				return;
			}

			// Get mobile and desktop object positions
			const mobileObjectPosition =
				img.getAttribute('data-object-position') ||
				img.style.objectPosition ||
				'50% 50%';
			const desktopObjectPosition =
				img.getAttribute('data-desktop-object-position') ||
				'50% 50%';

			// Get mobile and desktop alt text
			// Mobile alt is stored in the alt attribute initially
			const mobileAlt = img.getAttribute('alt') || '';
			// Desktop alt is stored in data-desktop-alt attribute
			const desktopAlt = img.getAttribute('data-desktop-alt') || '';

			console.log(mobileAlt, desktopAlt);

			// Set initial position and alt based on current viewport
			const mediaQuery = window.matchMedia('(max-width: 782px)');
			updateObjectPosition(img, mediaQuery, mobileObjectPosition, desktopObjectPosition);
			updateAltText(img, mediaQuery, mobileAlt, desktopAlt);

			// Listen for viewport changes
			mediaQuery.addEventListener('change', (e) => {
				updateObjectPosition(img, e, mobileObjectPosition, desktopObjectPosition);
				updateAltText(img, e, mobileAlt, desktopAlt);
			});
		});
	}

	/**
	 * Update object position based on media query.
	 *
	 * @param {HTMLElement} img                    Image element.
	 * @param {MediaQueryList|MediaQueryListEvent} mediaQuery Media query object.
	 * @param {string}                            mobilePosition  Mobile object position.
	 * @param {string}                            desktopPosition Desktop object position.
	 */
	function updateObjectPosition(img, mediaQuery, mobilePosition, desktopPosition) {
		if (mediaQuery.matches) {
			// Mobile view: use mobile position
			img.style.objectPosition = mobilePosition;
		} else {
			// Desktop view: use desktop position
			img.style.objectPosition = desktopPosition;
		}
	}

	/**
	 * Update alt text based on media query.
	 *
	 * @param {HTMLElement} img                    Image element.
	 * @param {MediaQueryList|MediaQueryListEvent} mediaQuery Media query object.
	 * @param {string}                            mobileAlt  Mobile alt text.
	 * @param {string}                            desktopAlt Desktop alt text.
	 */
	function updateAltText(img, mediaQuery, mobileAlt, desktopAlt) {
		if (mediaQuery.matches) {
			// Mobile view: use mobile alt
			img.setAttribute('alt', mobileAlt);
		} else {
			// Desktop view: use desktop alt
			img.setAttribute('alt', desktopAlt);
		}
	}

	// Initialize on DOM ready
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initFocalPointSwitching);
	} else {
		initFocalPointSwitching();
	}
})();

