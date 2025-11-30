/**
 * Registers the block variation and extends core/cover block.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-variations/
 */

// Import styles
import "./style.scss";

import { registerBlockVariation } from "@wordpress/blocks";
import { addFilter } from "@wordpress/hooks";
import { createHigherOrderComponent } from "@wordpress/compose";
import { InspectorControls } from "@wordpress/block-editor";
import {
	PanelBody,
	SelectControl,
	TextControl,
	ToggleControl,
	Button,
} from "@wordpress/components";

// MediaUpload and MediaUploadCheck need to be imported from block-editor
import { MediaUpload, MediaUploadCheck } from "@wordpress/block-editor";

// Import FocalPointPicker - check if it exists at runtime
import * as wpComponents from "@wordpress/components";
const FocalPointPicker = wpComponents.FocalPointPicker || null;
import { __ } from "@wordpress/i18n";
import { useSelect } from "@wordpress/data";
import { useEffect } from "@wordpress/element";
import { isBlobURL } from "@wordpress/blob";

/**
 * Register block variation for core/cover with mobile image support.
 */
registerBlockVariation("core/cover", {
	name: "mosne-hero-cover",
	title: __("Hero Cover (Mobile & Desktop)", "mosne-hero"),
	description: __(
		"Cover block with separate mobile and desktop background images.",
		"mosne-hero",
	),
	attributes: {
		variation: "mosne-hero-cover",
	},
	isDefault: false,
	scope: ["inserter", "transform"],
});

/**
 * Extend core/cover block with mobile image controls.
 */
const withMobileImageControls = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		const { name, attributes, setAttributes, clientId } = props;

		// Ensure BlockEdit is valid
		if (!BlockEdit || typeof BlockEdit !== "function") {
			return null;
		}

		// Only apply to core/cover blocks
		if (name !== "core/cover") {
			return <BlockEdit {...props} />;
		}

		// Check if this block uses our variation
		// The variation attribute should be set when the variation is selected
		const hasVariationAttr = attributes.variation === "mosne-hero-cover";

		// Show panel only if variation attribute is set
		// This ensures it only appears for blocks created from our variation
		if (!hasVariationAttr) {
			return <BlockEdit {...props} />;
		}

		const {
			mobileImageId = 0,
			mobileImageUrl = "",
			mobileFocalPoint,
			mobileImageSize = "large",
			mobileImageAlt = "",
			highFetchPriority = false,
		} = attributes;

		// Get mobile image data from media library
		const mobileImage = useSelect(
			(select) => {
				if (!mobileImageId || mobileImageId === 0) {
					return null;
				}
				try {
					const image = select("core").getMedia(mobileImageId);
					// If image doesn't exist or is an error, return null
					if (!image || image === undefined) {
						return null;
					}
					return image;
				} catch (error) {
					// Media doesn't exist or can't be accessed
					return null;
				}
			},
			[mobileImageId],
		);

		// Get image size options from WordPress (dynamically from registered sizes)
		// Fallback to default sizes if not available
		const imageSizeOptions =
			typeof mosneHeroData !== "undefined" && mosneHeroData.imageSizes
				? mosneHeroData.imageSizes
				: [
						{ label: __("Full Size", "mosne-hero"), value: "full" },
						{ label: __("Large", "mosne-hero"), value: "large" },
						{ label: __("Medium Large", "mosne-hero"), value: "medium_large" },
						{ label: __("Medium", "mosne-hero"), value: "medium" },
						{ label: __("Thumbnail", "mosne-hero"), value: "thumbnail" },
				  ];

		// Helper function to get image URL for a specific size
		const getImageUrlForSize = (image, size) => {
			if (!image) {
				return "";
			}

			if (size === "full") {
				return image.source_url || image.url || "";
			}

			if (image.media_details?.sizes?.[size]?.source_url) {
				return image.media_details.sizes[size].source_url;
			}

			return image.source_url || image.url || "";
		};

		// Update mobile image URL when image data or size changes
		useEffect(() => {
			if (mobileImage) {
				const url = getImageUrlForSize(mobileImage, mobileImageSize || "large");
				if (url) {
					setAttributes({ mobileImageUrl: url });
				}
			}
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [mobileImage, mobileImageSize]);

		// Note: The 404 error is expected when media doesn't exist
		// WordPress data store will handle this gracefully
		// The mobileImage will be undefined/null if the media doesn't exist

		const onSelectMobileImage = (image) => {
			const size = mobileImageSize || "large";
			const url = getImageUrlForSize(image, size);
			setAttributes({
				variation: attributes.variation || "mosne-hero-cover",
				mobileImageId: image.id,
				mobileImageUrl: url,
				mobileFocalPoint: mobileFocalPoint || { x: 0.5, y: 0.5 },
				mobileImageSize: mobileImageSize || "large",
				mobileImageAlt: mobileImageAlt || image.alt || "",
			});
		};

		const onRemoveMobileImage = () => {
			setAttributes({
				mobileImageId: 0,
				mobileImageUrl: "",
				mobileFocalPoint: undefined,
				mobileImageSize: undefined,
				mobileImageAlt: "",
			});
		};

		const mobileFocalPointValue = mobileFocalPoint || { x: 0.5, y: 0.5 };

		// Ensure all required components are available
		if (
			!PanelBody ||
			!MediaUpload ||
			!MediaUploadCheck ||
			!SelectControl ||
			!Button
		) {
			return <BlockEdit {...props} />;
		}

		if (!InspectorControls) {
			return <BlockEdit {...props} />;
		}

		return (
			<>
				<BlockEdit {...props} />
				<InspectorControls key="mosne-hero-mobile-image">
					<PanelBody
						title={__("Mobile Image", "mosne-hero")}
						initialOpen={true}
					>
						<MediaUploadCheck>
							<MediaUpload
								onSelect={onSelectMobileImage}
								allowedTypes={["image"]}
								value={mobileImageId > 0 ? mobileImageId : undefined}
								render={({ open }) => {
									if (typeof open !== "function") {
										return null;
									}
									const hasImage =
										mobileImageUrl &&
										typeof mobileImageUrl === "string" &&
										!isBlobURL(mobileImageUrl);

									return (
										<div>
											{hasImage ? (
												<>
													{FocalPointPicker && (
														<FocalPointPicker
															label={__("Focal Point Picker", "mosne-hero")}
															url={mobileImageUrl}
															value={mobileFocalPointValue}
															onChange={(value) => {
																if (
																	value &&
																	typeof value === "object" &&
																	typeof value.x === "number" &&
																	typeof value.y === "number"
																) {
																	setAttributes({ mobileFocalPoint: value });
																}
															}}
														/>
													)}
													<SelectControl
														label={__("Image Size", "mosne-hero")}
														value={mobileImageSize || "large"}
														options={imageSizeOptions}
														onChange={(value) => {
															setAttributes({ mobileImageSize: value });
															if (mobileImage) {
																const url = getImageUrlForSize(
																	mobileImage,
																	value,
																);
																if (url) {
																	setAttributes({ mobileImageUrl: url });
																}
															}
														}}
													/>
													<TextControl
														label={__("Alt Text", "mosne-hero")}
														value={mobileImageAlt || ""}
														onChange={(value) =>
															setAttributes({ mobileImageAlt: value })
														}
														help={__(
															"Describe the purpose of the image. Leave empty to use the image's default alt text.",
															"mosne-hero",
														)}
													/>
													<ToggleControl
														label={__("High Fetch Priority", "mosne-hero")}
														checked={highFetchPriority}
														onChange={(value) =>
															setAttributes({ highFetchPriority: value })
														}
														help={__(
															"Prioritize loading of both desktop and mobile images. Use for above-the-fold hero images.",
															"mosne-hero",
														)}
													/>
													<Button
														onClick={onRemoveMobileImage}
														variant="secondary"
														isDestructive
														style={{ marginTop: "10px", width: "100%" }}
													>
														{__("Remove mobile image", "mosne-hero")}
													</Button>
												</>
											) : (
												<Button onClick={open} variant="primary">
													{mobileImageId && mobileImageId > 0
														? __("Replace mobile image", "mosne-hero")
														: __("Select mobile image", "mosne-hero")}
												</Button>
											)}
										</div>
									);
								}}
							/>
						</MediaUploadCheck>
					</PanelBody>
				</InspectorControls>
			</>
		);
	};
}, "withMobileImageControls");

addFilter(
	"editor.BlockEdit",
	"mosne-hero/cover-with-mobile-image",
	withMobileImageControls,
	20, // Higher priority to ensure it runs
);
