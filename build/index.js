/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _wordpress_blob__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @wordpress/blob */ "@wordpress/blob");
/* harmony import */ var _wordpress_blob__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blob__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__);
/**
 * Registers the block variation and extends core/cover block.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-variations/
 */







// MediaUpload and MediaUploadCheck need to be imported from block-editor


// Import FocalPointPicker - check if it exists at runtime

const FocalPointPicker = _wordpress_components__WEBPACK_IMPORTED_MODULE_4__.FocalPointPicker || null;





/**
 * Register block variation for core/cover with mobile image support.
 */

(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockVariation)("core/cover", {
  name: "mosne-hero-cover",
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)("Hero Cover (Mobile & Desktop)", "mosne-hero"),
  description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)("Cover block with separate mobile and desktop background images and sizes.", "mosne-hero"),
  attributes: {
    variation: "mosne-hero-cover"
  },
  isDefault: false,
  scope: ["inserter", "transform"]
});

/**
 * Extend core/cover block with mobile image controls.
 */
const withMobileImageControls = (0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_2__.createHigherOrderComponent)(BlockEdit => {
  return props => {
    const {
      name,
      attributes,
      setAttributes,
      clientId
    } = props;

    // Ensure BlockEdit is valid
    if (!BlockEdit || typeof BlockEdit !== "function") {
      return null;
    }

    // Only apply to core/cover blocks
    if (name !== "core/cover") {
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(BlockEdit, {
        ...props
      });
    }

    // Check if this block uses our variation
    // The variation attribute should be set when the variation is selected
    const hasVariationAttr = attributes.variation === "mosne-hero-cover";

    // Show panel only if variation attribute is set
    // This ensures it only appears for blocks created from our variation
    if (!hasVariationAttr) {
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(BlockEdit, {
        ...props
      });
    }
    const {
      mobileImageId = 0,
      mobileImageUrl = "",
      mobileFocalPoint,
      mobileImageSize = "large",
      mobileImageAlt = "",
      highFetchPriority = false
    } = attributes;

    // Get mobile image data from media library
    const mobileImage = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_6__.useSelect)(select => {
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
    }, [mobileImageId]);

    // Get image size options from WordPress block editor settings
    const imageSizeOptions = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_6__.useSelect)(select => {
      const settings = select("core/block-editor").getSettings();
      const imageSizes = settings?.imageSizes || [];

      // Format image sizes for SelectControl
      const formattedSizes = imageSizes.map(size => ({
        label: size.name || size.slug,
        value: size.slug
      }));

      // Add 'full' size option if not already present
      const hasFull = formattedSizes.some(size => size.value === "full");
      if (!hasFull) {
        formattedSizes.unshift({
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)("Full Size", "mosne-hero"),
          value: "full"
        });
      }

      // Fallback to default sizes if no sizes available
      if (formattedSizes.length === 0) {
        return [{
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)("Full Size", "mosne-hero"),
          value: "full"
        }, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)("Large", "mosne-hero"),
          value: "large"
        }, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)("Medium Large", "mosne-hero"),
          value: "medium_large"
        }, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)("Medium", "mosne-hero"),
          value: "medium"
        }, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)("Thumbnail", "mosne-hero"),
          value: "thumbnail"
        }];
      }
      return formattedSizes;
    }, []);

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
    (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_7__.useEffect)(() => {
      if (mobileImage) {
        const url = getImageUrlForSize(mobileImage, mobileImageSize || "large");
        if (url) {
          setAttributes({
            mobileImageUrl: url
          });
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mobileImage, mobileImageSize]);

    // Note: The 404 error is expected when media doesn't exist
    // WordPress data store will handle this gracefully
    // The mobileImage will be undefined/null if the media doesn't exist

    const onSelectMobileImage = image => {
      const size = mobileImageSize || "large";
      const url = getImageUrlForSize(image, size);
      setAttributes({
        variation: attributes.variation || "mosne-hero-cover",
        mobileImageId: image.id,
        mobileImageUrl: url,
        mobileFocalPoint: mobileFocalPoint || {
          x: 0.5,
          y: 0.5
        },
        mobileImageSize: mobileImageSize || "large",
        mobileImageAlt: mobileImageAlt || image.alt || ""
      });
    };
    const onRemoveMobileImage = () => {
      setAttributes({
        mobileImageId: 0,
        mobileImageUrl: "",
        mobileFocalPoint: undefined,
        // Keep mobileImageSize when removing image - it will use desktop image with mobile size
        mobileImageAlt: ""
      });
    };
    const mobileFocalPointValue = mobileFocalPoint || {
      x: 0.5,
      y: 0.5
    };

    // Ensure all required components are available
    if (!_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.PanelBody || !_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.MediaUpload || !_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.MediaUploadCheck || !_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.SelectControl || !_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.Button) {
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(BlockEdit, {
        ...props
      });
    }
    if (!_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.InspectorControls) {
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(BlockEdit, {
        ...props
      });
    }
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.Fragment, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(BlockEdit, {
        ...props
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.InspectorControls, {
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.PanelBody, {
          title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)("Mobile Image", "mosne-hero"),
          initialOpen: true,
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.SelectControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)("Mobile Image Size", "mosne-hero"),
            value: mobileImageSize || "large",
            options: imageSizeOptions,
            onChange: value => {
              setAttributes({
                mobileImageSize: value
              });
              // Update URL if mobile image exists
              if (mobileImage) {
                const url = getImageUrlForSize(mobileImage, value);
                if (url) {
                  setAttributes({
                    mobileImageUrl: url
                  });
                }
              }
            },
            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)("Choose the image size for mobile view. If no mobile image is selected, the desktop image will be used with this size.", "mosne-hero")
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.ToggleControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)("High Fetch Priority", "mosne-hero"),
            checked: highFetchPriority,
            onChange: value => setAttributes({
              highFetchPriority: value
            }),
            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)("Prioritize loading of both desktop and mobile images. Use for above-the-fold hero images.", "mosne-hero")
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.MediaUploadCheck, {
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.MediaUpload, {
              onSelect: onSelectMobileImage,
              allowedTypes: ["image"],
              value: mobileImageId > 0 ? mobileImageId : undefined,
              render: ({
                open
              }) => {
                if (typeof open !== "function") {
                  return null;
                }
                const hasImage = mobileImageUrl && typeof mobileImageUrl === "string" && !(0,_wordpress_blob__WEBPACK_IMPORTED_MODULE_8__.isBlobURL)(mobileImageUrl);
                return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
                  children: hasImage ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.Fragment, {
                    children: [FocalPointPicker && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(FocalPointPicker, {
                      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)("Focal Point Picker", "mosne-hero"),
                      url: mobileImageUrl,
                      value: mobileFocalPointValue,
                      onChange: value => {
                        if (value && typeof value === "object" && typeof value.x === "number" && typeof value.y === "number") {
                          setAttributes({
                            mobileFocalPoint: value
                          });
                        }
                      }
                    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.TextControl, {
                      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)("Alt Text", "mosne-hero"),
                      value: mobileImageAlt || "",
                      onChange: value => setAttributes({
                        mobileImageAlt: value
                      }),
                      help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)("Describe the purpose of the image. Leave empty to use the image's default alt text.", "mosne-hero")
                    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.Button, {
                      onClick: onRemoveMobileImage,
                      variant: "secondary",
                      isDestructive: true,
                      style: {
                        marginTop: "10px",
                        width: "100%"
                      },
                      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)("Remove mobile image", "mosne-hero")
                    })]
                  }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.Button, {
                    onClick: open,
                    variant: "primary",
                    children: mobileImageId && mobileImageId > 0 ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)("Replace mobile image", "mosne-hero") : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)("Select mobile image", "mosne-hero")
                  })
                });
              }
            })
          })]
        })
      }, "mosne-hero-mobile-image")]
    });
  };
}, "withMobileImageControls");
(0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_1__.addFilter)("editor.BlockEdit", "mosne-hero/cover-with-mobile-image", withMobileImageControls, 20 // Higher priority to ensure it runs
);
})();

/******/ })()
;
//# sourceMappingURL=index.js.map