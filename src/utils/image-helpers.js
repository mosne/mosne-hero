/**
 * Image helper functions.
 *
 * @package MosneHero
 */

/**
 * Get image URL for a specific size.
 *
 * @param {Object} image Image object from media library.
 * @param {string} size  Image size name.
 * @return {string} Image URL.
 */
export function getImageUrlForSize(image, size) {
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
}

