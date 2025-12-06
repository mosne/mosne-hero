/**
 * Hook to get image sizes from WordPress block editor settings.
 *
 * @package MosneHero
 */

import { useSelect } from "@wordpress/data";
import { __ } from "@wordpress/i18n";

/**
 * Get image size options from WordPress block editor settings.
 *
 * @return {Array} Array of image size options with label and value.
 */
export function useImageSizes() {
	return useSelect((select) => {
		const settings = select("core/block-editor").getSettings();
		const imageSizes = settings?.imageSizes || [];

		// Format image sizes for SelectControl
		const formattedSizes = imageSizes.map((size) => ({
			label: size.name || size.slug,
			value: size.slug,
		}));

		// Add 'full' size option if not already present
		const hasFull = formattedSizes.some((size) => size.value === "full");
		if (!hasFull) {
			formattedSizes.unshift({
				label: __("Full Size", "mosne-hero"),
				value: "full",
			});
		}

		// Fallback to default sizes if no sizes available
		if (formattedSizes.length === 0) {
			return [
				{ label: __("Full Size", "mosne-hero"), value: "full" },
				{ label: __("Large", "mosne-hero"), value: "large" },
				{ label: __("Medium Large", "mosne-hero"), value: "medium_large" },
				{ label: __("Medium", "mosne-hero"), value: "medium" },
				{ label: __("Thumbnail", "mosne-hero"), value: "thumbnail" },
			];
		}

		return formattedSizes;
	}, []);
}

