/**
 * Mobile Image Panel component.
 *
 * @package MosneHero
 */

import { InspectorControls } from "@wordpress/block-editor";
import {
	PanelBody,
	SelectControl,
	TextControl,
	ToggleControl,
	Button,
	Notice,
} from "@wordpress/components";
import { MediaUpload, MediaUploadCheck } from "@wordpress/block-editor";
import * as wpComponents from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { useEffect } from "@wordpress/element";
import { isBlobURL } from "@wordpress/blob";

import { getImageUrlForSize } from "../utils/image-helpers";
import { useImageSizes } from "../hooks/use-image-sizes";
import { useMobileImage } from "../hooks/use-mobile-image";
import { buildWarningMessage, isMobileUnavailable } from "../utils/warning-message";

const FocalPointPicker = wpComponents.FocalPointPicker || null;

/**
 * Mobile Image Panel component.
 *
 * @param {Object} props Component props.
 * @param {Object} props.attributes Block attributes.
 * @param {Function} props.setAttributes Function to update attributes.
 * @return {JSX.Element} Panel component.
 */
export function MobileImagePanel({ attributes, setAttributes }) {
	const {
		mobileImageId = 0,
		mobileImageUrl = "",
		mobileFocalPoint,
		mobileImageSize = "large",
		mobileImageAlt = "",
		highFetchPriority = false,
	} = attributes;

	// Get mobile image data
	const mobileImage = useMobileImage(mobileImageId);
	const imageSizeOptions = useImageSizes();

	// Check if mobile image feature is unavailable
	const mobileUnavailable = isMobileUnavailable(attributes);
	const warningMessage = buildWarningMessage(attributes);

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

	const onSelectMobileImage = (image) => {
		if (mobileUnavailable) {
			return;
		}

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
		if (mobileUnavailable) {
			return;
		}

		setAttributes({
			mobileImageId: 0,
			mobileImageUrl: "",
			mobileFocalPoint: undefined,
			// Keep mobileImageSize when removing image - it will use desktop image with mobile size
			mobileImageAlt: "",
		});
	};

	const mobileFocalPointValue = mobileFocalPoint || { x: 0.5, y: 0.5 };
	const hasImage =
		mobileImageUrl &&
		typeof mobileImageUrl === "string" &&
		!isBlobURL(mobileImageUrl);

	return (
		<InspectorControls key="mosne-hero-mobile-image">
			<PanelBody title={__("Mobile Image", "mosne-hero")} initialOpen={true}>
				{/* Warning message if mobile version is unavailable */}
				{mobileUnavailable && warningMessage && (
					<Notice
						status="warning"
						isDismissible={false}
						className="mosne-hero-warning"
					>
						{warningMessage}
					</Notice>
				)}

				{/* Mobile Image Size Selector - Always visible */}
				<SelectControl
					label={__("Mobile Image Size", "mosne-hero")}
					value={mobileImageSize || "large"}
					options={imageSizeOptions}
					disabled={mobileUnavailable}
					onChange={(value) => {
						if (mobileUnavailable) {
							return;
						}
						setAttributes({ mobileImageSize: value });
						// Update URL if mobile image exists
						if (mobileImage) {
							const url = getImageUrlForSize(mobileImage, value);
							if (url) {
								setAttributes({ mobileImageUrl: url });
							}
						}
					}}
					help={__(
						"Choose the image size for mobile view. If no mobile image is selected, the desktop image will be used with this size.",
						"mosne-hero"
					)}
				/>

				{/* High Fetch Priority Toggle - Always visible */}
				<ToggleControl
					label={__("High Fetch Priority", "mosne-hero")}
					checked={highFetchPriority}
					disabled={mobileUnavailable}
					onChange={(value) => {
						if (mobileUnavailable) {
							return;
						}
						setAttributes({ highFetchPriority: value });
					}}
					help={__(
						"Prioritize loading of both desktop and mobile images. Use for above-the-fold hero images.",
						"mosne-hero"
					)}
				/>

				<MediaUploadCheck>
					<MediaUpload
						onSelect={onSelectMobileImage}
						allowedTypes={["image"]}
						value={mobileImageId > 0 ? mobileImageId : undefined}
						render={({ open }) => {
							if (typeof open !== "function") {
								return null;
							}

							// Prevent opening media library if mobile is unavailable
							const handleOpen = () => {
								if (!mobileUnavailable) {
									open();
								}
							};

							return (
								<div>
									{hasImage ? (
										<>
											{FocalPointPicker && (
												<FocalPointPicker
													label={__("Focal Point Picker", "mosne-hero")}
													url={mobileImageUrl}
													value={mobileFocalPointValue}
													disabled={mobileUnavailable}
													onChange={(value) => {
														if (mobileUnavailable) {
															return;
														}
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
											<TextControl
												label={__("Alt Text", "mosne-hero")}
												value={mobileImageAlt || ""}
												disabled={mobileUnavailable}
												onChange={(value) => {
													if (mobileUnavailable) {
														return;
													}
													setAttributes({ mobileImageAlt: value });
												}}
												help={__(
													"Describe the purpose of the image. Leave empty to use the image's default alt text.",
													"mosne-hero"
												)}
											/>
											<Button
												onClick={onRemoveMobileImage}
												variant="secondary"
												isDestructive
												disabled={mobileUnavailable}
												style={{ marginTop: "10px", width: "100%" }}
											>
												{__("Remove mobile image", "mosne-hero")}
											</Button>
										</>
									) : (
										<Button
											onClick={handleOpen}
											variant="primary"
											disabled={mobileUnavailable}
										>
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
	);
}

