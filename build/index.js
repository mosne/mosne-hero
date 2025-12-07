/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/components/mobile-image-panel.js":
/*!**********************************************!*\
  !*** ./src/components/mobile-image-panel.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MobileImagePanel: () => (/* binding */ MobileImagePanel)
/* harmony export */ });
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_blob__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/blob */ "@wordpress/blob");
/* harmony import */ var _wordpress_blob__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blob__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _utils_image_helpers__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/image-helpers */ "./src/utils/image-helpers.js");
/* harmony import */ var _hooks_use_image_sizes__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../hooks/use-image-sizes */ "./src/hooks/use-image-sizes.js");
/* harmony import */ var _hooks_use_mobile_image__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../hooks/use-mobile-image */ "./src/hooks/use-mobile-image.js");
/* harmony import */ var _utils_warning_message__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../utils/warning-message */ "./src/utils/warning-message.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__);
/**
 * Mobile Image Panel component.
 *
 * @package
 */











/**
 * Mobile Image Panel component.
 *
 * @param {Object}   props               Component props.
 * @param {Object}   props.attributes    Block attributes.
 * @param {Function} props.setAttributes Function to update attributes.
 * @return {JSX.Element} Panel component.
 */

function MobileImagePanel({
  attributes,
  setAttributes
}) {
  const {
    mobileImageId = 0,
    mobileImageUrl = '',
    mobileFocalPoint,
    mobileImageSize = 'large',
    mobileImageAlt = '',
    highFetchPriority = false
  } = attributes;

  // Get mobile image data
  const mobileImage = (0,_hooks_use_mobile_image__WEBPACK_IMPORTED_MODULE_7__.useMobileImage)(mobileImageId);
  const imageSizeOptions = (0,_hooks_use_image_sizes__WEBPACK_IMPORTED_MODULE_6__.useImageSizes)();

  // Check if mobile image feature is unavailable
  const mobileUnavailable = (0,_utils_warning_message__WEBPACK_IMPORTED_MODULE_8__.isMobileUnavailable)(attributes);
  const warningMessage = (0,_utils_warning_message__WEBPACK_IMPORTED_MODULE_8__.buildWarningMessage)(attributes);

  // Update mobile image URL when image data or size changes
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useEffect)(() => {
    if (mobileImage) {
      const url = (0,_utils_image_helpers__WEBPACK_IMPORTED_MODULE_5__.getImageUrlForSize)(mobileImage, mobileImageSize || 'large');
      if (url) {
        setAttributes({
          mobileImageUrl: url
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mobileImage, mobileImageSize]);
  const onSelectMobileImage = image => {
    if (mobileUnavailable) {
      return;
    }
    const size = mobileImageSize || 'large';
    const url = (0,_utils_image_helpers__WEBPACK_IMPORTED_MODULE_5__.getImageUrlForSize)(image, size);
    setAttributes({
      variation: attributes.variation || 'mosne-hero-cover',
      mobileImageId: image.id,
      mobileImageUrl: url,
      mobileFocalPoint: mobileFocalPoint || {
        x: 0.5,
        y: 0.5
      },
      mobileImageSize: mobileImageSize || 'large',
      mobileImageAlt: mobileImageAlt || image.alt || ''
    });
  };
  const onRemoveMobileImage = () => {
    if (mobileUnavailable) {
      return;
    }
    setAttributes({
      mobileImageId: 0,
      mobileImageUrl: '',
      mobileFocalPoint: undefined,
      // Keep mobileImageSize when removing image - it will use desktop image with mobile size
      mobileImageAlt: ''
    });
  };
  const mobileFocalPointValue = mobileFocalPoint || {
    x: 0.5,
    y: 0.5
  };
  const hasImage = mobileImageUrl && typeof mobileImageUrl === 'string' && !(0,_wordpress_blob__WEBPACK_IMPORTED_MODULE_4__.isBlobURL)(mobileImageUrl);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.InspectorControls, {
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.PanelBody, {
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Mobile Image', 'mosne-hero'),
      initialOpen: true,
      children: [mobileUnavailable && warningMessage && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Notice, {
        status: "warning",
        isDismissible: false,
        className: "mosne-hero-warning",
        children: warningMessage
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.SelectControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Mobile Image Size', 'mosne-hero'),
        value: mobileImageSize || 'large',
        options: imageSizeOptions,
        disabled: mobileUnavailable,
        onChange: value => {
          if (mobileUnavailable) {
            return;
          }
          setAttributes({
            mobileImageSize: value
          });
          // Update URL if mobile image exists
          if (mobileImage) {
            const url = (0,_utils_image_helpers__WEBPACK_IMPORTED_MODULE_5__.getImageUrlForSize)(mobileImage, value);
            if (url) {
              setAttributes({
                mobileImageUrl: url
              });
            }
          }
        },
        help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Choose the image size for mobile view. If no mobile image is selected, the desktop image will be used with this size.', 'mosne-hero')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ToggleControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('High Fetch Priority', 'mosne-hero'),
        checked: highFetchPriority,
        disabled: mobileUnavailable,
        onChange: value => {
          if (mobileUnavailable) {
            return;
          }
          setAttributes({
            highFetchPriority: value
          });
        },
        help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Prioritize loading of both desktop and mobile images. Use for above-the-fold hero images.', 'mosne-hero')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.MediaUploadCheck, {
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.MediaUpload, {
          onSelect: onSelectMobileImage,
          allowedTypes: ['image'],
          value: mobileImageId > 0 ? mobileImageId : undefined,
          render: ({
            open
          }) => {
            if (typeof open !== 'function') {
              return null;
            }

            // Prevent opening media library if mobile is unavailable
            const handleOpen = () => {
              if (!mobileUnavailable) {
                open();
              }
            };
            return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
              children: hasImage ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.Fragment, {
                children: [_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.FocalPointPicker && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.FocalPointPicker, {
                  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Focal Point Picker', 'mosne-hero'),
                  url: mobileImageUrl,
                  value: mobileFocalPointValue,
                  disabled: mobileUnavailable,
                  onChange: value => {
                    if (mobileUnavailable) {
                      return;
                    }
                    if (value && typeof value === 'object' && typeof value.x === 'number' && typeof value.y === 'number') {
                      setAttributes({
                        mobileFocalPoint: value
                      });
                    }
                  }
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.TextareaControl, {
                  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Alt Text', 'mosne-hero'),
                  value: mobileImageAlt || '',
                  rows: 4,
                  disabled: mobileUnavailable,
                  onChange: value => {
                    if (mobileUnavailable) {
                      return;
                    }
                    setAttributes({
                      mobileImageAlt: value
                    });
                  },
                  help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Describe the purpose of the image. Leave empty to use the image's default alt text.", 'mosne-hero')
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
                  onClick: onRemoveMobileImage,
                  variant: "secondary",
                  isDestructive: true,
                  disabled: mobileUnavailable,
                  style: {
                    marginTop: '10px',
                    width: '100%',
                    justifyContent: 'center'
                  },
                  children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Remove mobile image', 'mosne-hero')
                })]
              }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
                onClick: handleOpen,
                variant: "primary",
                disabled: mobileUnavailable,
                children: mobileImageId && mobileImageId > 0 ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Replace mobile image', 'mosne-hero') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Select mobile image', 'mosne-hero')
              })
            });
          }
        })
      })]
    })
  }, "mosne-hero-mobile-image");
}

/***/ }),

/***/ "./src/hooks/use-image-sizes.js":
/*!**************************************!*\
  !*** ./src/hooks/use-image-sizes.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useImageSizes: () => (/* binding */ useImageSizes)
/* harmony export */ });
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/**
 * Hook to get image sizes from WordPress block editor settings.
 *
 * @package
 */




/**
 * Get image size options from WordPress block editor settings.
 *
 * @return {Array} Array of image size options with label and value.
 */
function useImageSizes() {
  return (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.useSelect)(select => {
    const settings = select('core/block-editor').getSettings();
    const imageSizes = settings?.imageSizes || [];

    // Format image sizes for SelectControl
    const formattedSizes = imageSizes.map(size => ({
      label: size.name || size.slug,
      value: size.slug
    }));

    // Add 'full' size option if not already present
    const hasFull = formattedSizes.some(size => size.value === 'full');
    if (!hasFull) {
      formattedSizes.unshift({
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Full Size', 'mosne-hero'),
        value: 'full'
      });
    }

    // Fallback to default sizes if no sizes available
    if (formattedSizes.length === 0) {
      return [{
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Full Size', 'mosne-hero'),
        value: 'full'
      }, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Large', 'mosne-hero'),
        value: 'large'
      }, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Medium Large', 'mosne-hero'),
        value: 'medium_large'
      }, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Medium', 'mosne-hero'),
        value: 'medium'
      }, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Thumbnail', 'mosne-hero'),
        value: 'thumbnail'
      }];
    }
    return formattedSizes;
  }, []);
}

/***/ }),

/***/ "./src/hooks/use-mobile-image.js":
/*!***************************************!*\
  !*** ./src/hooks/use-mobile-image.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useMobileImage: () => (/* binding */ useMobileImage)
/* harmony export */ });
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_0__);
/**
 * Hook to get mobile image data from media library.
 *
 * @package
 */



/**
 * Get mobile image data from media library.
 *
 * @param {number} mobileImageId Mobile image ID.
 * @return {Object|null} Image object or null if not found.
 */
function useMobileImage(mobileImageId) {
  return (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.useSelect)(select => {
    if (!mobileImageId || mobileImageId === 0) {
      return null;
    }
    try {
      const image = select('core').getMedia(mobileImageId);
      // If image doesn't exist or is an error, return null
      if (!image || image === undefined) {
        return null;
      }
      return image;
    } catch (error) {
      // Media doesn't exist or can't be accessed
      return null;
    }
  }, [mobileImageId]);
}

/***/ }),

/***/ "./src/utils/image-helpers.js":
/*!************************************!*\
  !*** ./src/utils/image-helpers.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getImageUrlForSize: () => (/* binding */ getImageUrlForSize)
/* harmony export */ });
/**
 * Image helper functions.
 *
 * @package
 */

/**
 * Get image URL for a specific size.
 *
 * @param {Object} image Image object from media library.
 * @param {string} size  Image size name.
 * @return {string} Image URL.
 */
function getImageUrlForSize(image, size) {
  if (!image) {
    return '';
  }
  if (size === 'full') {
    return image.source_url || image.url || '';
  }
  if (image.media_details?.sizes?.[size]?.source_url) {
    return image.media_details.sizes[size].source_url;
  }
  return image.source_url || image.url || '';
}

/***/ }),

/***/ "./src/utils/warning-message.js":
/*!**************************************!*\
  !*** ./src/utils/warning-message.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   buildWarningMessage: () => (/* binding */ buildWarningMessage),
/* harmony export */   isMobileUnavailable: () => (/* binding */ isMobileUnavailable)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/**
 * Warning message utilities.
 *
 * @package
 */



/**
 * Build dynamic warning message based on which options are enabled.
 *
 * @param {Object} attributes Block attributes.
 * @return {string} Warning message, empty string if no warnings needed.
 */
function buildWarningMessage(attributes) {
  const hasParallax = attributes.hasParallax || false;
  const backgroundType = attributes.backgroundType || 'image';
  const isRepeated = attributes.isRepeated || false;

  // Build array of reasons
  const unavailableReasons = [];
  if (hasParallax) {
    unavailableReasons.push((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Parallax', 'mosne-hero'));
  }
  if (backgroundType !== 'image') {
    const backgroundTypeLabel = backgroundType === 'video' ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Video background', 'mosne-hero') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Non-image background', 'mosne-hero');
    unavailableReasons.push(backgroundTypeLabel);
  }
  if (isRepeated) {
    unavailableReasons.push((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Repeated', 'mosne-hero'));
  }

  // Generate dynamic warning message
  if (unavailableReasons.length === 0) {
    return '';
  }
  if (unavailableReasons.length === 1) {
    return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.sprintf)(/* translators: %s: feature name (e.g., Parallax, Video background) */
    (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('The mobile version is not available when %s is enabled.', 'mosne-hero'), unavailableReasons[0]);
  }
  if (unavailableReasons.length === 2) {
    return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.sprintf)(/* translators: %1$s: first feature, %2$s: second feature */
    (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('The mobile version is not available when %1$s or %2$s are enabled.', 'mosne-hero'), unavailableReasons[0], unavailableReasons[1]);
  }

  // 3 or more reasons
  const lastReason = unavailableReasons.pop();
  const otherReasons = unavailableReasons.join(', ');
  return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.sprintf)(/* translators: %1$s: list of features, %2$s: last feature */
  (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('The mobile version is not available when %1$s, and %2$s are enabled.', 'mosne-hero'), otherReasons, lastReason);
}

/**
 * Check if mobile image feature is unavailable.
 *
 * @param {Object} attributes Block attributes.
 * @return {boolean} True if mobile image is unavailable.
 */
function isMobileUnavailable(attributes) {
  const hasParallax = attributes.hasParallax || false;
  const backgroundType = attributes.backgroundType || 'image';
  const isRepeated = attributes.isRepeated || false;
  return hasParallax || backgroundType !== 'image' || isRepeated;
}

/***/ }),

/***/ "@wordpress/blob":
/*!******************************!*\
  !*** external ["wp","blob"] ***!
  \******************************/
/***/ ((module) => {

module.exports = window["wp"]["blob"];

/***/ }),

/***/ "@wordpress/block-editor":
/*!*************************************!*\
  !*** external ["wp","blockEditor"] ***!
  \*************************************/
/***/ ((module) => {

module.exports = window["wp"]["blockEditor"];

/***/ }),

/***/ "@wordpress/blocks":
/*!********************************!*\
  !*** external ["wp","blocks"] ***!
  \********************************/
/***/ ((module) => {

module.exports = window["wp"]["blocks"];

/***/ }),

/***/ "@wordpress/components":
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
/***/ ((module) => {

module.exports = window["wp"]["components"];

/***/ }),

/***/ "@wordpress/compose":
/*!*********************************!*\
  !*** external ["wp","compose"] ***!
  \*********************************/
/***/ ((module) => {

module.exports = window["wp"]["compose"];

/***/ }),

/***/ "@wordpress/data":
/*!******************************!*\
  !*** external ["wp","data"] ***!
  \******************************/
/***/ ((module) => {

module.exports = window["wp"]["data"];

/***/ }),

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/***/ ((module) => {

module.exports = window["wp"]["element"];

/***/ }),

/***/ "@wordpress/hooks":
/*!*******************************!*\
  !*** external ["wp","hooks"] ***!
  \*******************************/
/***/ ((module) => {

module.exports = window["wp"]["hooks"];

/***/ }),

/***/ "@wordpress/i18n":
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
/***/ ((module) => {

module.exports = window["wp"]["i18n"];

/***/ }),

/***/ "react/jsx-runtime":
/*!**********************************!*\
  !*** external "ReactJSXRuntime" ***!
  \**********************************/
/***/ ((module) => {

module.exports = window["ReactJSXRuntime"];

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/hooks */ "@wordpress/hooks");
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_hooks__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/compose */ "@wordpress/compose");
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_compose__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _components_mobile_image_panel__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/mobile-image-panel */ "./src/components/mobile-image-panel.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);
/**
 * Registers the block variation and extends core/cover block.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-variations/
 * @package
 */







/**
 * Register block variation for core/cover with mobile image support.
 */

(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockVariation)('core/cover', {
  name: 'mosne-hero-cover',
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Hero Cover (Mobile & Desktop)', 'mosne-hero'),
  description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Cover block with separate mobile and desktop background images and sizes.', 'mosne-hero'),
  attributes: {
    variation: 'mosne-hero-cover'
  },
  isDefault: false,
  scope: ['inserter', 'transform']
});

/**
 * Extend core/cover block with mobile image controls.
 */
const withMobileImageControls = (0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_2__.createHigherOrderComponent)(BlockEdit => {
  return props => {
    const {
      name,
      attributes
    } = props;

    // Ensure BlockEdit is valid
    if (!BlockEdit || typeof BlockEdit !== 'function') {
      return null;
    }

    // Only apply to core/cover blocks
    if (name !== 'core/cover') {
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(BlockEdit, {
        ...props
      });
    }

    // Check if this block uses our variation
    const hasVariationAttr = attributes.variation === 'mosne-hero-cover';

    // Show panel only if variation attribute is set
    if (!hasVariationAttr) {
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(BlockEdit, {
        ...props
      });
    }
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.Fragment, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(BlockEdit, {
        ...props
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_components_mobile_image_panel__WEBPACK_IMPORTED_MODULE_4__.MobileImagePanel, {
        attributes: attributes,
        setAttributes: props.setAttributes
      })]
    });
  };
}, 'withMobileImageControls');
(0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_1__.addFilter)('editor.BlockEdit', 'mosne-hero/cover-with-mobile-image', withMobileImageControls, 20 // Higher priority to ensure it runs
);
})();

/******/ })()
;
//# sourceMappingURL=index.js.map