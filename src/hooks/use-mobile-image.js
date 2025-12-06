/**
 * Hook to get mobile image data from media library.
 *
 * @package MosneHero
 */

import { useSelect } from "@wordpress/data";

/**
 * Get mobile image data from media library.
 *
 * @param {number} mobileImageId Mobile image ID.
 * @return {Object|null} Image object or null if not found.
 */
export function useMobileImage(mobileImageId) {
	return useSelect(
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
		[mobileImageId]
	);
}

