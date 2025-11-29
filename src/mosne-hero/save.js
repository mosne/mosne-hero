/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @param {Object} props Block props.
 * @return {Element} Element to render.
 */
export default function save( { attributes } ) {
	const {
		desktopImageId,
		desktopImageUrl,
		mobileImageId,
		mobileImageUrl,
		overlayColor,
		overlayOpacity,
		minHeight,
		desktopFocalPoint,
		mobileFocalPoint,
	} = attributes;

	const blockProps = useBlockProps.save( {
		className: 'wp-block-create-block-mosne-hero',
		style: {
			minHeight: `${ minHeight }px`,
		},
	} );

	const overlayStyle = {
		backgroundColor: overlayColor,
		opacity: overlayOpacity,
	};

	// Calculate object-position from focal point
	const getObjectPosition = ( focalPoint ) => {
		if ( ! focalPoint || typeof focalPoint.x === 'undefined' || typeof focalPoint.y === 'undefined' ) {
			return '50% 50%';
		}
		return `${ focalPoint.x * 100 }% ${ focalPoint.y * 100 }%`;
	};

	// Ensure focal points have defaults
	const desktopFocalPointValue = desktopFocalPoint || { x: 0.5, y: 0.5 };
	const mobileFocalPointValue = mobileFocalPoint || { x: 0.5, y: 0.5 };

	const desktopImageStyle = desktopImageUrl
		? {
				objectPosition: getObjectPosition( desktopFocalPointValue ),
		  }
		: {};

	const mobileImageStyle = mobileImageUrl
		? {
				objectPosition: getObjectPosition( mobileFocalPointValue ),
		  }
		: {};

	return (
		<div { ...blockProps }>
			<div className="mosne-hero-background">
				{ desktopImageUrl && (
					<img
						className="mosne-hero-background-image mosne-hero-background-desktop"
						src={ desktopImageUrl }
						alt=""
						style={ desktopImageStyle }
						data-image-id={ desktopImageId }
					/>
				) }
				{ mobileImageUrl && (
					<img
						className="mosne-hero-background-image mosne-hero-background-mobile"
						src={ mobileImageUrl }
						alt=""
						style={ mobileImageStyle }
						data-image-id={ mobileImageId }
					/>
				) }
				<div className="mosne-hero-overlay" style={ overlayStyle } />
			</div>
			<div className="mosne-hero-content">
				<InnerBlocks.Content />
			</div>
		</div>
	);
}
