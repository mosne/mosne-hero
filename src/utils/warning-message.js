/**
 * Warning message utilities.
 *
 * @package
 */

import { __, sprintf } from '@wordpress/i18n';

/**
 * Build dynamic warning message based on which options are enabled.
 *
 * @param {Object} attributes Block attributes.
 * @return {string} Warning message, empty string if no warnings needed.
 */
export function buildWarningMessage( attributes ) {
	const hasParallax = attributes.hasParallax || false;
	const backgroundType = attributes.backgroundType || 'image';
	const isRepeated = attributes.isRepeated || false;

	// Build array of reasons
	const unavailableReasons = [];
	if ( hasParallax ) {
		unavailableReasons.push( __( 'Parallax', 'mosne-hero' ) );
	}
	if ( backgroundType !== 'image' ) {
		const backgroundTypeLabel =
			backgroundType === 'video'
				? __( 'Video background', 'mosne-hero' )
				: __( 'Non-image background', 'mosne-hero' );
		unavailableReasons.push( backgroundTypeLabel );
	}
	if ( isRepeated ) {
		unavailableReasons.push( __( 'Repeated', 'mosne-hero' ) );
	}

	// Generate dynamic warning message
	if ( unavailableReasons.length === 0 ) {
		return '';
	}

	if ( unavailableReasons.length === 1 ) {
		return sprintf(
			/* translators: %s: feature name (e.g., Parallax, Video background) */
			__(
				'The mobile version is not available when %s is enabled.',
				'mosne-hero'
			),
			unavailableReasons[ 0 ]
		);
	}

	if ( unavailableReasons.length === 2 ) {
		return sprintf(
			/* translators: %1$s: first feature, %2$s: second feature */
			__(
				'The mobile version is not available when %1$s or %2$s are enabled.',
				'mosne-hero'
			),
			unavailableReasons[ 0 ],
			unavailableReasons[ 1 ]
		);
	}

	// 3 or more reasons
	const lastReason = unavailableReasons.pop();
	const otherReasons = unavailableReasons.join( ', ' );
	return sprintf(
		/* translators: %1$s: list of features, %2$s: last feature */
		__(
			'The mobile version is not available when %1$s, and %2$s are enabled.',
			'mosne-hero'
		),
		otherReasons,
		lastReason
	);
}

/**
 * Check if mobile image feature is unavailable.
 *
 * @param {Object} attributes Block attributes.
 * @return {boolean} True if mobile image is unavailable.
 */
export function isMobileUnavailable( attributes ) {
	const hasParallax = attributes.hasParallax || false;
	const backgroundType = attributes.backgroundType || 'image';
	const isRepeated = attributes.isRepeated || false;

	return hasParallax || backgroundType !== 'image' || isRepeated;
}
