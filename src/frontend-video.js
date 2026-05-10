/**
 * Frontend script to handle video switching based on media queries.
 *
 * @package MosneHero
 */

( function () {
	'use strict';

	/**
	 * Initialize video switching for hero video blocks.
	 */
	function initVideoSwitching() {
		// Find all video elements with mobile video support
		const videoElements = document.querySelectorAll(
			'.has-mobile-image video.wp-block-cover__video-background'
		);

		if ( ! videoElements.length ) {
			return;
		}

		// Process video elements
		videoElements.forEach( ( video ) => {
			// Get mobile and desktop poster URLs
			const mobilePosterUrl = video.getAttribute( 'data-poster-mobile' ) || '';
			const desktopPosterUrl = video.getAttribute( 'data-poster-desktop' ) || '';

			// Get mobile and desktop video URLs (mobile-first approach)
			const desktopVideoUrl = video.getAttribute( 'data-video-desktop' ) || '';
			const mobileVideoUrl = video.getAttribute( 'data-video-mobile' ) || video.src || '';

			// Get breakpoint from localized settings, fallback to 728px
			const breakpoint =
				( window.mosneHeroSettings &&
					window.mosneHeroSettings.breakpoint ) ||
				728;
			const mediaQuery = window.matchMedia(
				`(max-width: ${ breakpoint }px)`
			);

			// Set initial poster based on current viewport
			updateVideoPoster(
				video,
				mediaQuery,
				mobilePosterUrl,
				desktopPosterUrl
			);
			updateVideoSrc(
				video,
				mediaQuery,
				mobileVideoUrl,
				desktopVideoUrl
			);

			// Listen for viewport changes
			mediaQuery.addEventListener( 'change', ( e ) => {
				updateVideoPoster(
					video,
					e,
					mobilePosterUrl,
					desktopPosterUrl
				);
				updateVideoSrc(
					video,
					e,
					mobileVideoUrl,
					desktopVideoUrl
				);
			} );
		} );
	}

	/**
	 * Update video poster based on media query.
	 *
	 * @param {HTMLElement}                        video          Video element.
	 * @param {MediaQueryList|MediaQueryListEvent} mediaQuery     Media query object.
	 * @param {string}                             mobilePoster   Mobile poster URL.
	 * @param {string}                             desktopPoster  Desktop poster URL.
	 */
	function updateVideoPoster( video, mediaQuery, mobilePoster, desktopPoster ) {
		if ( mediaQuery.matches && mobilePoster ) {
			// Mobile view: use mobile poster
			video.setAttribute( 'poster', mobilePoster );
		} else if ( desktopPoster ) {
			// Desktop view: use desktop poster
			video.setAttribute( 'poster', desktopPoster );
		}
	}

	/**
	 * Update video source based on media query (mobile-first approach).
	 *
	 * @param {HTMLElement}                        video         Video element.
	 * @param {MediaQueryList|MediaQueryListEvent} mediaQuery    Media query object.
	 * @param {string}                             mobileVideo   Mobile video URL (primary).
	 * @param {string}                             desktopVideo  Desktop video URL (fallback).
	 */
	function updateVideoSrc( video, mediaQuery, mobileVideo, desktopVideo ) {
		if ( ! mediaQuery.matches && desktopVideo ) {
			// Desktop view: switch to desktop video if available
			if ( video.src !== desktopVideo ) {
				video.src = desktopVideo;
				video.load(); // Reload video with new source
			}
		} else if ( mediaQuery.matches && mobileVideo ) {
			// Mobile view: switch to mobile video if needed
			if ( video.src !== mobileVideo ) {
				video.src = mobileVideo;
				video.load(); // Reload video with new source
			}
		}
	}

	// Initialize on DOM ready
	if ( document.readyState === 'loading' ) {
		document.addEventListener(
			'DOMContentLoaded',
			initVideoSwitching
		);
	} else {
		initVideoSwitching();
	}
} )();
