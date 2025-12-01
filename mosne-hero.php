<?php
/**
 * Plugin Name:       Mosne Hero
 * Description:       Extends core/cover block with separate mobile and desktop background images.
 * Version:           0.1.1
 * Requires at least: 6.7
 * Requires PHP:      7.4
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       mosne-hero
 *
 * @package MosneHero
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Register additional attributes for core/cover block.
 *
 * @param array $metadata Block metadata.
 * @return array Modified metadata.
 */
function mosne_hero_register_cover_attributes( $metadata ) {
	if ( 'core/cover' === $metadata['name'] ) {
		if ( ! isset( $metadata['attributes'] ) ) {
			$metadata['attributes'] = array();
		}

		$metadata['attributes']['variation'] = array(
			'type' => 'string',
		);

		$metadata['attributes']['mobileImageId'] = array(
			'type' => 'number',
		);

		$metadata['attributes']['mobileImageUrl'] = array(
			'type' => 'string',
		);

		$metadata['attributes']['mobileFocalPoint'] = array(
			'type' => 'object',
		);

		$metadata['attributes']['mobileImageSize'] = array(
			'type' => 'string',
		);

		$metadata['attributes']['mobileImageAlt'] = array(
			'type' => 'string',
		);

		$metadata['attributes']['highFetchPriority'] = array(
			'type' => 'boolean',
			'default' => false,
		);
	}

	return $metadata;
}
add_filter( 'block_type_metadata', 'mosne_hero_register_cover_attributes' );

/**
 * Add custom image sizes to block editor settings.
 *
 * @since 0.1.1
 *
 * @param array $editor_settings Block editor settings.
 * @return array Modified editor settings.
 */
function mosne_hero_add_image_sizes_to_editor( $editor_settings ) {
	// Ensure imageSizes array exists
	if ( ! isset( $editor_settings['imageSizes'] ) ) {
		$editor_settings['imageSizes'] = array();
	}

	// Add custom hero mobile sizes
	$editor_settings['imageSizes'][] = array(
		'slug'   => 'mosne-hero-mobile-retina',
		'name'   => __( 'Hero Mobile', 'mosne-hero' ),
		'width'  => 414,
		'height' => 736,
	);

	return $editor_settings;
}
add_filter( 'block_editor_settings_all', 'mosne_hero_add_image_sizes_to_editor', 10, 1 );

/**
 * Enqueue block editor assets (scripts only).
 * Styles are handled via import in JavaScript for proper iframe loading.
 *
 * @since 0.1.1
 *
 * @return void
 */
function mosne_hero_enqueue_editor_assets() {
	$asset_file = include plugin_dir_path( __FILE__ ) . 'build/index.asset.php';

	wp_enqueue_script(
		'mosne-hero-editor',
		plugin_dir_url( __FILE__ ) . 'build/index.js',
		$asset_file['dependencies'],
		$asset_file['version'],
		true
	);

	// Note: Image sizes are now retrieved from WordPress block editor settings
	// using wp.data.select('core/block-editor').getSettings().imageSizes in JavaScript
}
add_action( 'enqueue_block_editor_assets', 'mosne_hero_enqueue_editor_assets' );

/**
 * Enqueue frontend script for focal point switching.
 *
 * @return void
 */
function mosne_hero_enqueue_frontend_script() {
	// Only enqueue on singular pages where blocks might be used
	if ( ! is_singular() ) {
		return;
	}

	$frontend_file = plugin_dir_path( __FILE__ ) . 'build/frontend.js';
	if ( ! file_exists( $frontend_file ) ) {
		return;
	}

	wp_enqueue_script(
		'mosne-hero-frontend',
		plugin_dir_url( __FILE__ ) . 'build/frontend.js',
		array(),
		filemtime( $frontend_file ),
		true
	);
}
add_action( 'wp_enqueue_scripts', 'mosne_hero_enqueue_frontend_script' );

// add image size for mobile image 414x736 and retina 828x1472
add_image_size( 'mosne-hero-mobile', 414, 736, true );
add_image_size( 'mosne-hero-mobile-retina', 828, 1472, true );


/**
 * Get desktop image ID from block attributes, including featured image support.
 *
 * @since 0.1.1
 *
 * @param array $attributes Block attributes.
 * @return int Desktop image ID, or 0 if not found.
 */
function mosne_hero_get_desktop_image_id( $attributes ) {
	$desktop_image_id = isset( $attributes['id'] ) ? absint( $attributes['id'] ) : 0;

	// Use featured image if useFeaturedImage is enabled and no desktop image is set.
	if ( ! $desktop_image_id && ! empty( $attributes['useFeaturedImage'] ) ) {
		$post_id = get_the_ID();
		if ( $post_id ) {
			$thumbnail_id = get_post_thumbnail_id( $post_id );
			if ( $thumbnail_id > 0 ) {
				$desktop_image_id = $thumbnail_id;
			}
		}
	}

	return $desktop_image_id;
}

/**
 * Convert focal point array to CSS object-position value.
 *
 * @since 0.1.1
 *
 * @param array $focal_point Focal point with 'x' and 'y' keys (0-1 range).
 * @return string CSS object-position value (e.g., "50% 50%").
 */
function mosne_hero_focal_point_to_position( $focal_point ) {
	if ( ! is_array( $focal_point ) || ! isset( $focal_point['x'] ) || ! isset( $focal_point['y'] ) ) {
		return '50% 50%';
	}

	$x = max( 0, min( 1, (float) $focal_point['x'] ) );
	$y = max( 0, min( 1, (float) $focal_point['y'] ) );

	return ( $x * 100 ) . '% ' . ( $y * 100 ) . '%';
}

/**
 * Get image alt text, with fallback to attachment meta.
 *
 * @since 0.1.1
 *
 * @param string $custom_alt     Custom alt text from attributes.
 * @param int    $mobile_image_id Mobile image ID.
 * @param int    $desktop_image_id Desktop image ID.
 * @return string Alt text, empty string if none found.
 */
function mosne_hero_get_alt_text( $custom_alt, $mobile_image_id, $desktop_image_id ) {
	if ( ! empty( $custom_alt ) ) {
		return sanitize_text_field( $custom_alt );
	}

	// Try mobile image first, then desktop.
	$image_id = $mobile_image_id > 0 ? $mobile_image_id : $desktop_image_id;
	if ( $image_id > 0 ) {
		$alt = get_post_meta( $image_id, '_wp_attachment_image_alt', true );
		if ( ! empty( $alt ) ) {
			return sanitize_text_field( $alt );
		}
	}

	return '';
}

/**
 * Get image width for a given size name.
 *
 * @since 0.1.1
 *
 * @param string $size_name Image size name.
 * @param array  $image_src Optional. Image src array from wp_get_attachment_image_src().
 * @return int Image width in pixels, or 0 if unknown.
 */
function mosne_hero_get_image_width( $size_name, $image_src = null ) {
	// Try to get from registered sizes first.
	if ( function_exists( 'wp_get_registered_image_subsizes' ) ) {
		$size_info = wp_get_registered_image_subsizes();
		if ( isset( $size_info[ $size_name ]['width'] ) && $size_info[ $size_name ]['width'] > 0 ) {
			return (int) $size_info[ $size_name ]['width'];
		}
	}

	// Fallback: get from image src array.
	if ( $image_src && isset( $image_src[1] ) && $image_src[1] > 0 ) {
		return (int) $image_src[1];
	}

	// Fallback: use WordPress default sizes.
	$default_widths = array(
		'thumbnail'    => 150,
		'medium'       => 300,
		'medium_large' => 768,
		'large'        => 1024,
		'full'         => 1920,
	);

	if ( isset( $default_widths[ $size_name ] ) ) {
		$option_key = $size_name . '_size_w';
		if ( 'full' !== $size_name ) {
			return (int) get_option( $option_key, $default_widths[ $size_name ] );
		}
		return $default_widths[ $size_name ];
	}

	return 0;
}

/**
 * Build sizes attribute for responsive images.
 *
 * @since 0.1.1
 *
 * @param int $image_width Image width in pixels.
 * @return string Sizes attribute value.
 */
function mosne_hero_build_sizes_attr( $image_width ) {
	if ( $image_width > 0 ) {
		return sprintf( '(max-width: %dpx) 100vw, %dpx', $image_width, $image_width );
	}
	return '100vw';
}

/**
 * Find desktop image HTML in block content.
 *
 * @since 0.1.1
 *
 * @param string $block_content Block HTML content.
 * @return string|false Image HTML tag, or false if not found.
 */
function mosne_hero_find_desktop_image( $block_content ) {
	if ( ! class_exists( 'WP_HTML_Tag_Processor' ) ) {
		return false;
	}

	$tag_processor = new WP_HTML_Tag_Processor( $block_content );

	while ( $tag_processor->next_tag( array( 'tag_name' => 'IMG' ) ) ) {
		$class = $tag_processor->get_attribute( 'class' );
		if ( ! $class ) {
			continue;
		}

		// Check for cover block image classes.
		if ( strpos( $class, 'wp-block-cover__image-background' ) !== false || strpos( $class, 'wp-image-' ) !== false ) {
			// Try to extract the full img tag using regex.
			$pattern = '/<img[^>]*class="[^"]*' . preg_quote( str_replace( ' ', '.*', $class ), '/' ) . '[^"]*"[^"]*>/i';
			if ( preg_match( $pattern, $block_content, $matches ) ) {
				return $matches[0];
			}

			// Fallback: simpler pattern.
			if ( preg_match( '/<img[^>]*class="[^"]*wp-block-cover[^"]*"[^"]*>/i', $block_content, $matches ) ) {
				return $matches[0];
			}

			// Last resort: first img tag.
			if ( preg_match( '/<img[^>]*>/i', $block_content, $matches ) ) {
				return $matches[0];
			}
		}
	}

	return false;
}

/**
 * Optimize img tag for use inside picture element.
 *
 * Removes redundant srcset/sizes and sets src to mobile image URL.
 *
 * @since 0.1.1
 *
 * @param string $img_html         Original img HTML tag.
 * @param string $mobile_src_url   Mobile image URL for src attribute.
 * @param string $mobile_position  Mobile object position.
 * @param string $desktop_position Desktop object position.
 * @param bool   $high_priority    Whether to add fetchpriority="high".
 * @return string Optimized img HTML tag.
 */
function mosne_hero_optimize_img_for_picture( $img_html, $mobile_src_url, $mobile_position, $desktop_position, $high_priority = false ) {
	// Remove redundant srcset and sizes attributes.
	$img_html = preg_replace( '/\s*(?:srcset|sizes)="[^"]*"/i', '', $img_html );

	// Update or add src attribute with mobile URL.
	if ( $mobile_src_url ) {
		if ( preg_match( '/src="[^"]*"/i', $img_html ) ) {
			$img_html = preg_replace( '/src="[^"]*"/i', 'src="' . esc_url( $mobile_src_url ) . '"', $img_html );
		} else {
			$img_html = preg_replace( '/(<img[^>]*)(>)/i', '$1 src="' . esc_url( $mobile_src_url ) . '"$2', $img_html, 1 );
		}
	}

	// Extract and preserve existing style, removing object-position.
	$existing_style = '';
	if ( preg_match( '/style="([^"]*)"/i', $img_html, $style_match ) ) {
		$existing_style = preg_replace( '/object-position:[^;]*;?/i', '', $style_match[1] );
		$existing_style = trim( $existing_style );
	}

	// Build new style with mobile position.
	$style_value = 'object-position:' . esc_attr( $mobile_position );
	if ( $existing_style ) {
		$style_value .= '; ' . esc_attr( $existing_style );
	}

	// Update style attribute.
	if ( strpos( $img_html, 'style=' ) !== false ) {
		$img_html = preg_replace( '/style="[^"]*"/i', 'style="' . esc_attr( $style_value ) . '"', $img_html );
	} else {
		$img_html = preg_replace( '/(<img[^>]*)(>)/i', '$1 style="' . esc_attr( $style_value ) . '"$2', $img_html, 1 );
	}

	// Add or update data attributes for object position.
	$data_attrs = array(
		'data-object-position'         => esc_attr( $mobile_position ),
		'data-desktop-object-position' => esc_attr( $desktop_position ),
	);

	foreach ( $data_attrs as $attr_name => $attr_value ) {
		if ( strpos( $img_html, $attr_name ) !== false ) {
			$img_html = preg_replace( '/' . preg_quote( $attr_name, '/' ) . '="[^"]*"/i', $attr_name . '="' . $attr_value . '"', $img_html );
		} else {
			$img_html = preg_replace( '/(<img[^>]*)(>)/i', '$1 ' . $attr_name . '="' . $attr_value . '"$2', $img_html, 1 );
		}
	}

	// Add fetchpriority if enabled.
	if ( $high_priority && strpos( $img_html, 'fetchpriority' ) === false ) {
		$img_html = preg_replace( '/(<img[^>]*)(>)/i', '$1 fetchpriority="high"$2', $img_html, 1 );
	}

	return $img_html;
}

/**
 * Build picture element HTML with mobile and desktop sources.
 *
 * @since 0.1.1
 *
 * @param array $args {
 *     Arguments for building the picture element.
 *
 *     @type string $mobile_srcset    Mobile image srcset.
 *     @type string $mobile_src       Mobile image src URL.
 *     @type string $mobile_sizes     Mobile sizes attribute.
 *     @type string $desktop_srcset   Desktop image srcset.
 *     @type string $desktop_sizes    Desktop sizes attribute.
 *     @type string $img_html          Fallback img tag HTML.
 * }
 * @return string Picture element HTML.
 */
function mosne_hero_build_picture_element( $args ) {
	$args = wp_parse_args(
		$args,
		array(
			'mobile_srcset'  => '',
			'mobile_src'     => '',
			'mobile_sizes'   => '100vw',
			'desktop_srcset' => '',
			'desktop_sizes'  => '100vw',
			'img_html'       => '',
		)
	);

	$picture_html = '<picture class="wp-block-cover__image-background">';

	// Mobile source (max-width: 782px).
	if ( ! empty( $args['mobile_srcset'] ) ) {
		$picture_html .= '<source media="(max-width: 782px)" srcset="' . esc_attr( $args['mobile_srcset'] ) . '" sizes="' . esc_attr( $args['mobile_sizes'] ) . '">';
	} elseif ( ! empty( $args['mobile_src'] ) ) {
		$picture_html .= '<source media="(max-width: 782px)" srcset="' . esc_url( $args['mobile_src'] ) . '" sizes="' . esc_attr( $args['mobile_sizes'] ) . '">';
	}

	// Desktop source (min-width: 783px).
	if ( ! empty( $args['desktop_srcset'] ) ) {
		$picture_html .= '<source media="(min-width: 783px)" srcset="' . esc_attr( $args['desktop_srcset'] ) . '" sizes="' . esc_attr( $args['desktop_sizes'] ) . '">';
	}

	// Fallback img tag.
	if ( ! empty( $args['img_html'] ) ) {
		$picture_html .= $args['img_html'];
	}

	$picture_html .= '</picture>';

	return $picture_html;
}

/**
 * Add has-mobile-image class to cover block wrapper.
 *
 * @since 0.1.1
 *
 * @param string $block_content Block HTML content.
 * @return string Modified block content.
 */
function mosne_hero_add_wrapper_class( $block_content ) {
	if ( ! class_exists( 'WP_HTML_Tag_Processor' ) ) {
		return $block_content;
	}

	$tag_processor = new WP_HTML_Tag_Processor( $block_content );

	while ( $tag_processor->next_tag( array( 'tag_name' => 'DIV' ) ) ) {
		$class = $tag_processor->get_attribute( 'class' );
		if ( $class && strpos( $class, 'wp-block-cover' ) !== false && strpos( $class, 'has-mobile-image' ) === false ) {
			$tag_processor->add_class( 'has-mobile-image' );
			break;
		}
	}

	return $tag_processor->get_updated_html();
}

/**
 * Filter cover block output to add mobile image support.
 *
 * This function extends the core/cover block to support separate mobile and desktop
 * background images with responsive picture element markup.
 *
 * @since 0.1.1
 *
 * @param string $block_content The rendered block content.
 * @param array  $parsed_block  The parsed block array.
 * @return string Filtered block content.
 */
function mosne_hero_render_cover_block( $block_content, $parsed_block ) {
	// Early return if not a core/cover block.
	if ( 'core/cover' !== ( $parsed_block['blockName'] ?? '' ) ) {
		return $block_content;
	}

	$attributes = $parsed_block['attrs'] ?? array();

	// Early return if not our variation.
	if ( ! isset( $attributes['variation'] ) || 'mosne-hero-cover' !== $attributes['variation'] ) {
		return $block_content;
	}

	// Extract and validate attributes.
	$mobile_image_id    = isset( $attributes['mobileImageId'] ) ? absint( $attributes['mobileImageId'] ) : 0;
	$mobile_focal_point = $attributes['mobileFocalPoint'] ?? array( 'x' => 0.5, 'y' => 0.5 );
	$mobile_image_size  = isset( $attributes['mobileImageSize'] ) ? sanitize_text_field( $attributes['mobileImageSize'] ) : 'large';
	$mobile_image_alt   = isset( $attributes['mobileImageAlt'] ) ? sanitize_text_field( $attributes['mobileImageAlt'] ) : '';
	$high_fetch_priority = ! empty( $attributes['highFetchPriority'] );

	// Get desktop image ID (supports featured image).
	$desktop_image_id = mosne_hero_get_desktop_image_id( $attributes );

	// Early return if no images available.
	if ( ! $mobile_image_id && ! $desktop_image_id ) {
		return $block_content;
	}

	// Handle case where desktop image is used for mobile.
	$use_desktop_for_mobile = ( ! $mobile_image_id && $desktop_image_id > 0 );
	if ( $use_desktop_for_mobile ) {
		$mobile_image_id = $desktop_image_id;
		if ( ! isset( $attributes['mobileFocalPoint'] ) ) {
			$mobile_focal_point = $attributes['focalPoint'] ?? array( 'x' => 0.5, 'y' => 0.5 );
		}
	}

	// Convert focal points to CSS positions.
	$mobile_object_position  = mosne_hero_focal_point_to_position( $mobile_focal_point );
	$desktop_focal_point      = $attributes['focalPoint'] ?? array( 'x' => 0.5, 'y' => 0.5 );
	$desktop_object_position  = mosne_hero_focal_point_to_position( $desktop_focal_point );

	// Get alt text with fallback.
	$alt_text = mosne_hero_get_alt_text( $mobile_image_alt, $mobile_image_id, $desktop_image_id );

	// Get mobile image data.
	$actual_mobile_image_id = $use_desktop_for_mobile ? $desktop_image_id : $mobile_image_id;
	$mobile_srcset          = $actual_mobile_image_id > 0 ? wp_get_attachment_image_srcset( $actual_mobile_image_id, $mobile_image_size ) : '';
	$mobile_image_src       = $actual_mobile_image_id > 0 ? wp_get_attachment_image_src( $actual_mobile_image_id, $mobile_image_size ) : false;
	$mobile_image_width     = mosne_hero_get_image_width( $mobile_image_size, $mobile_image_src );

	// Add wrapper class for mobile image support.
	$block_content = mosne_hero_add_wrapper_class( $block_content );

	// Build picture element if we have both images or using desktop for mobile.
	if ( $desktop_image_id > 0 && ( $mobile_image_id > 0 || $use_desktop_for_mobile ) ) {
		$desktop_image_html = mosne_hero_find_desktop_image( $block_content );

		if ( $desktop_image_html ) {
			// Get desktop image data.
			$desktop_srcset = wp_get_attachment_image_srcset( $desktop_image_id );
			if ( ! $desktop_srcset && preg_match( '/srcset="([^"]*)"/i', $desktop_image_html, $srcset_match ) ) {
				$desktop_srcset = $srcset_match[1];
			}

			$desktop_image_data = wp_get_attachment_image_src( $desktop_image_id, 'full' );
			$desktop_image_width = 0;
			if ( preg_match( '/width="(\d+)"/i', $desktop_image_html, $width_match ) ) {
				$desktop_image_width = (int) $width_match[1];
			} elseif ( $desktop_image_data && isset( $desktop_image_data[1] ) ) {
				$desktop_image_width = (int) $desktop_image_data[1];
			} else {
				$desktop_image_width = (int) get_option( 'large_size_w', 1024 );
			}

			// Get mobile src URL for fallback img tag.
			$mobile_src_url = '';
			if ( $mobile_image_src && isset( $mobile_image_src[0] ) ) {
				$mobile_src_url = $mobile_image_src[0];
			} elseif ( $mobile_srcset && preg_match( '/^([^,\s]+)/', $mobile_srcset, $srcset_url_match ) ) {
				$mobile_src_url = trim( $srcset_url_match[1] );
			}

			// Optimize img tag for picture element.
			$optimized_img = mosne_hero_optimize_img_for_picture(
				$desktop_image_html,
				$mobile_src_url,
				$mobile_object_position,
				$desktop_object_position,
				$high_fetch_priority
			);

			// Build picture element.
			$picture_html = mosne_hero_build_picture_element(
				array(
					'mobile_srcset'  => $mobile_srcset,
					'mobile_src'     => $mobile_image_src ? $mobile_image_src[0] : '',
					'mobile_sizes'  => mosne_hero_build_sizes_attr( $mobile_image_width ),
					'desktop_srcset' => $desktop_srcset,
					'desktop_sizes'  => mosne_hero_build_sizes_attr( $desktop_image_width ),
					'img_html'       => $optimized_img,
				)
			);

			// Replace desktop image with picture element.
			$block_content = str_replace( $desktop_image_html, $picture_html, $block_content );
		}
	} else {
		// Fallback: simple modifications when no picture element needed.
		if ( ! class_exists( 'WP_HTML_Tag_Processor' ) ) {
			return $block_content;
		}

		$tag_processor = new WP_HTML_Tag_Processor( $block_content );

		// Add class and fetchpriority to desktop image.
		while ( $tag_processor->next_tag( array( 'tag_name' => 'IMG' ) ) ) {
			$class = $tag_processor->get_attribute( 'class' );
			if ( $class && strpos( $class, 'wp-block-cover__image-background' ) !== false ) {
				if ( strpos( $class, 'mosne-hero-desktop-image' ) === false ) {
					$tag_processor->add_class( 'mosne-hero-desktop-image' );
				}

				if ( $high_fetch_priority && ! $tag_processor->get_attribute( 'fetchpriority' ) ) {
					$tag_processor->set_attribute( 'fetchpriority', 'high' );
				}
			}
		}

		$block_content = $tag_processor->get_updated_html();

		// Add mobile image if only mobile exists (no desktop).
		if ( $mobile_image_id > 0 && $desktop_image_id === 0 ) {
			$mobile_image_attrs = array(
				'class'                      => 'mosne-hero-mobile-image wp-block-cover__image-background wp-image-' . absint( $mobile_image_id ) . ' size-' . esc_attr( $mobile_image_size ),
				'data-object-fit'            => 'cover',
				'alt'                        => esc_attr( $alt_text ),
				'data-object-position'       => esc_attr( $mobile_object_position ),
				'data-desktop-object-position' => esc_attr( $desktop_object_position ),
				'style'                      => 'object-position:' . esc_attr( $mobile_object_position ) . ';',
			);

			if ( $high_fetch_priority ) {
				$mobile_image_attrs['fetchpriority'] = 'high';
			}

			$mobile_image_html = wp_get_attachment_image(
				$mobile_image_id,
				$mobile_image_size,
				false,
				$mobile_image_attrs
			);

			// Insert mobile image before desktop image.
			$tag_processor = new WP_HTML_Tag_Processor( $block_content );
			while ( $tag_processor->next_tag( array( 'tag_name' => 'IMG' ) ) ) {
				$class = $tag_processor->get_attribute( 'class' );
				if ( $class && ( strpos( $class, 'mosne-hero-desktop-image' ) !== false || strpos( $class, 'wp-block-cover__image-background' ) !== false ) ) {
					$pattern = '/<img[^>]*class="[^"]*' . preg_quote( str_replace( ' ', '.*', $class ), '/' ) . '[^"]*"[^"]*>/i';
					if ( preg_match( $pattern, $block_content, $img_matches, PREG_OFFSET_CAPTURE ) ) {
						$block_content = substr_replace( $block_content, $mobile_image_html, $img_matches[0][1], 0 );
					}
					break;
				}
			}
		}
	}

	return $block_content;
}
add_filter( 'render_block_core/cover', 'mosne_hero_render_cover_block', 10, 2 );
