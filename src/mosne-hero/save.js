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
		contentPosition,
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

	const backgroundStyle = {
		backgroundPosition: contentPosition,
	};

	return (
		<div { ...blockProps }>
			<div className="mosne-hero-background" style={ backgroundStyle }>
				{ desktopImageUrl && (
					<div
						className="mosne-hero-background-image mosne-hero-background-desktop"
						style={ {
							backgroundImage: `url(${ desktopImageUrl })`,
						} }
						data-image-id={ desktopImageId }
					/>
				) }
				{ mobileImageUrl && (
					<div
						className="mosne-hero-background-image mosne-hero-background-mobile"
						style={ {
							backgroundImage: `url(${ mobileImageUrl })`,
						} }
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
