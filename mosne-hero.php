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
 * Get all registered image sizes for JavaScript.
 *
 * @return array Array of image sizes with labels and values.
 */
function mosne_hero_get_image_sizes() {
	// Get standard WordPress image sizes
	$standard_sizes = array( 'thumbnail', 'medium', 'medium_large', 'large', 'full' );
	
	// Get all registered image sizes
	$all_sizes = get_intermediate_image_sizes();
	
	// Merge with full size
	$all_sizes[] = 'full';
	
	// Remove duplicates and sort
	$all_sizes = array_unique( $all_sizes );
	
	// Build options array
	$image_size_options = array();
	
	// Get registered image sizes info (WordPress 5.3+)
	$size_info = function_exists( 'wp_get_registered_image_subsizes' ) 
		? wp_get_registered_image_subsizes() 
		: array();
	
	foreach ( $all_sizes as $size ) {
		// Build label
		$label = ucwords( str_replace( array( '-', '_' ), ' ', $size ) );
		
		// If it's a standard size, use WordPress default labels
		if ( 'full' === $size ) {
			$label = __( 'Full Size', 'mosne-hero' );
		} elseif ( 'large' === $size ) {
			$label = __( 'Large', 'mosne-hero' );
		} elseif ( 'medium_large' === $size ) {
			$label = __( 'Medium Large', 'mosne-hero' );
		} elseif ( 'medium' === $size ) {
			$label = __( 'Medium', 'mosne-hero' );
		} elseif ( 'thumbnail' === $size ) {
			$label = __( 'Thumbnail', 'mosne-hero' );
		} else {
			// For custom sizes, add dimensions if available
			if ( ! empty( $size_info ) && isset( $size_info[ $size ] ) ) {
				$width = $size_info[ $size ]['width'] ?? 0;
				$height = $size_info[ $size ]['height'] ?? 0;
				if ( $width > 0 && $height > 0 ) {
					$label = sprintf( '%s (%dx%d)', $label, $width, $height );
				}
			}
		}
		
		$image_size_options[] = array(
			'label' => $label,
			'value' => $size,
		);
	}
	
	// Sort by label
	usort( $image_size_options, function( $a, $b ) {
		// Put 'full' first, then sort alphabetically
		if ( 'full' === $a['value'] ) {
			return -1;
		}
		if ( 'full' === $b['value'] ) {
			return 1;
		}
		return strcmp( $a['label'], $b['label'] );
	} );
	
	return $image_size_options;
}

/**
 * Enqueue block editor assets (scripts only).
 * Styles are handled via import in JavaScript for proper iframe loading.
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

	// Localize script with image sizes
	wp_localize_script(
		'mosne-hero-editor',
		'mosneHeroData',
		array(
			'imageSizes' => mosne_hero_get_image_sizes(),
		)
	);
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
 * Register meta fields for mobile image.
 *
 * @return void
 */
function mosne_hero_register_meta() {
	$post_types = get_post_types( array( 'public' => true ), 'names' );

	foreach ( $post_types as $post_type ) {
		register_post_meta(
			$post_type,
			'_mosne_hero_mobile_image_id',
			array(
				'show_in_rest' => true,
				'single'       => true,
				'type'         => 'integer',
				'auth_callback' => function() {
					return current_user_can( 'edit_posts' );
				},
			)
		);

		register_post_meta(
			$post_type,
			'_mosne_hero_mobile_image_url',
			array(
				'show_in_rest' => true,
				'single'       => true,
				'type'         => 'string',
				'auth_callback' => function() {
					return current_user_can( 'edit_posts' );
				},
			)
		);
	}
}
add_action( 'init', 'mosne_hero_register_meta' );

/**
 * Save mobile image meta when post is saved.
 *
 * @param int     $post_id Post ID.
 * @param WP_Post $post    Post object.
 * @return void
 */
function mosne_hero_save_meta( $post_id, $post ) {
	// Check autosave
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}

	// Check permissions
	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}

	// Check if this is a revision
	if ( wp_is_post_revision( $post_id ) ) {
		return;
	}

	// Parse blocks from post content
	if ( ! isset( $post->post_content ) ) {
		return;
	}

	$blocks = parse_blocks( $post->post_content );

	if ( empty( $blocks ) ) {
		return;
	}

	// Find core/cover blocks with our variation and save mobile image meta
	foreach ( $blocks as $block ) {
		if ( 'core/cover' === $block['blockName'] ) {
			$attrs = $block['attrs'] ?? array();

			// Check if this is our variation
			if ( isset( $attrs['variation'] ) && 'mosne-hero-cover' === $attrs['variation'] ) {
				// Save mobile image
				if ( isset( $attrs['mobileImageId'] ) && $attrs['mobileImageId'] > 0 ) {
					$mobile_id = absint( $attrs['mobileImageId'] );
					update_post_meta( $post_id, '_mosne_hero_mobile_image_id', $mobile_id );

					if ( isset( $attrs['mobileImageUrl'] ) && ! empty( $attrs['mobileImageUrl'] ) ) {
						update_post_meta( $post_id, '_mosne_hero_mobile_image_url', esc_url_raw( $attrs['mobileImageUrl'] ) );
					}
				} else {
					// Remove meta if image is removed
					delete_post_meta( $post_id, '_mosne_hero_mobile_image_id' );
					delete_post_meta( $post_id, '_mosne_hero_mobile_image_url' );
				}
			}
		}
	}
}
add_action( 'save_post', 'mosne_hero_save_meta', 10, 2 );

/**
 * Filter cover block output to add mobile image.
 *
 * @param string $block_content The rendered block content.
 * @param array  $parsed_block  The parsed block array.
 * @return string Filtered block content.
 */
function mosne_hero_render_cover_block( $block_content, $parsed_block ) {
	// Check if this is a core/cover block with our variation
	if ( 'core/cover' !== ( $parsed_block['blockName'] ?? '' ) ) {
		return $block_content;
	}

	$attributes = $parsed_block['attrs'] ?? array();

	if ( ! isset( $attributes['variation'] ) || 'mosne-hero-cover' !== $attributes['variation'] ) {
		return $block_content;
	}

	// Get mobile image attributes
	$mobile_image_id   = $attributes['mobileImageId'] ?? 0;
	$mobile_focal_point = $attributes['mobileFocalPoint'] ?? array( 'x' => 0.5, 'y' => 0.5 );
	$mobile_image_size  = $attributes['mobileImageSize'] ?? 'large';
	$mobile_image_alt   = $attributes['mobileImageAlt'] ?? '';
	$high_fetch_priority = $attributes['highFetchPriority'] ?? false;

	// Get desktop image ID
	// WordPress cover block stores the background image ID in 'id' attribute
	$desktop_image_id = $attributes['id'] ?? 0;

	// If no mobile image and no desktop image, return as-is
	if ( ! $mobile_image_id && ! $desktop_image_id ) {
		return $block_content;
	}

	// If no mobile image but we have desktop image, use desktop image with mobile size
	$use_desktop_for_mobile = ( ! $mobile_image_id && $desktop_image_id > 0 );
	if ( $use_desktop_for_mobile ) {
		$mobile_image_id = $desktop_image_id;
		// Use desktop focal point if mobile focal point not set
		if ( ! isset( $attributes['mobileFocalPoint'] ) ) {
			$mobile_focal_point = $attributes['focalPoint'] ?? array( 'x' => 0.5, 'y' => 0.5 );
		}
	}

	// Prepare mobile image data
	$mobile_object_position = '50% 50%';
	if ( isset( $mobile_focal_point['x'] ) && isset( $mobile_focal_point['y'] ) ) {
		$mobile_object_position = ( $mobile_focal_point['x'] * 100 ) . '% ' . ( $mobile_focal_point['y'] * 100 ) . '%';
	}

	// Prepare desktop image focal point
	$desktop_focal_point = $attributes['focalPoint'] ?? array( 'x' => 0.5, 'y' => 0.5 );
	$desktop_object_position = '50% 50%';
	if ( isset( $desktop_focal_point['x'] ) && isset( $desktop_focal_point['y'] ) ) {
		$desktop_object_position = ( $desktop_focal_point['x'] * 100 ) . '% ' . ( $desktop_focal_point['y'] * 100 ) . '%';
	}

	// Get alt text
	$alt_text = $mobile_image_alt;
	if ( empty( $alt_text ) ) {
		if ( $mobile_image_id > 0 ) {
			$alt_text = get_post_meta( $mobile_image_id, '_wp_attachment_image_alt', true );
		} elseif ( $desktop_image_id > 0 ) {
			$alt_text = get_post_meta( $desktop_image_id, '_wp_attachment_image_alt', true );
		}
	}
	if ( empty( $alt_text ) ) {
		$alt_text = '';
	}

	// Get mobile image srcset and src for picture element
	// If using desktop for mobile, use desktop image ID with mobile size
	$actual_mobile_image_id = $use_desktop_for_mobile ? $desktop_image_id : $mobile_image_id;
	$mobile_srcset = wp_get_attachment_image_srcset( $actual_mobile_image_id, $mobile_image_size );
	$mobile_image_src = wp_get_attachment_image_src( $actual_mobile_image_id, $mobile_image_size );
	
	// Get mobile image size width for sizes attribute
	$mobile_image_width = 0;
	if ( function_exists( 'wp_get_registered_image_subsizes' ) ) {
		$size_info = wp_get_registered_image_subsizes();
		if ( isset( $size_info[ $mobile_image_size ] ) && isset( $size_info[ $mobile_image_size ]['width'] ) ) {
			$mobile_image_width = $size_info[ $mobile_image_size ]['width'];
		}
	}
	// Fallback: get width from image src if available
	if ( ! $mobile_image_width && $mobile_image_src && isset( $mobile_image_src[1] ) ) {
		$mobile_image_width = $mobile_image_src[1];
	}
	// Fallback: use standard WordPress sizes
	if ( ! $mobile_image_width ) {
		switch ( $mobile_image_size ) {
			case 'thumbnail':
				$mobile_image_width = (int) get_option( 'thumbnail_size_w', 150 );
				break;
			case 'medium':
				$mobile_image_width = (int) get_option( 'medium_size_w', 300 );
				break;
			case 'medium_large':
				$mobile_image_width = (int) get_option( 'medium_large_size_w', 768 );
				break;
			case 'large':
				$mobile_image_width = (int) get_option( 'large_size_w', 1024 );
				break;
			case 'full':
				// For full size, use a large breakpoint
				$mobile_image_width = 1920;
				break;
		}
	}

	// Use WP_HTML_Tag_Processor for safe HTML manipulation (WordPress 6.2+)
	if ( ! class_exists( 'WP_HTML_Tag_Processor' ) ) {
		return $block_content;
	}

	$tag_processor = new WP_HTML_Tag_Processor( $block_content );

	// Add class to cover block wrapper
	while ( $tag_processor->next_tag( array( 'tag_name' => 'DIV' ) ) ) {
		$class = $tag_processor->get_attribute( 'class' );
		if ( $class && strpos( $class, 'wp-block-cover' ) !== false && strpos( $class, 'has-mobile-image' ) === false ) {
			$tag_processor->add_class( 'has-mobile-image' );
			break;
		}
	}

	$block_content = $tag_processor->get_updated_html();

	// If we have mobile image (or using desktop for mobile), try to replace desktop image with picture element
	// Even if desktop_image_id is 0, we can still find the desktop image in the HTML
	if ( $mobile_image_id > 0 && $desktop_image_id > 0 ) {
		// Find the desktop image using WP_HTML_Tag_Processor
		$tag_processor = new WP_HTML_Tag_Processor( $block_content );
		$desktop_image_found = false;

		// Try to find any img tag in the cover block (desktop image)
		// WordPress cover block may use different class names
		while ( $tag_processor->next_tag( array( 'tag_name' => 'IMG' ) ) ) {
			$class = $tag_processor->get_attribute( 'class' );
			// Check for wp-block-cover__image-background or wp-image- classes
			if ( $class && ( strpos( $class, 'wp-block-cover__image-background' ) !== false || strpos( $class, 'wp-image-' ) !== false ) ) {
				$desktop_image_found = true;
				
				// Extract the full img tag from original content
				// Try multiple patterns to find the image
				$pattern = '/<img[^>]*class="[^"]*' . preg_quote( str_replace( ' ', '.*', $class ), '/' ) . '[^"]*"[^"]*>/i';
				preg_match( $pattern, $block_content, $matches );
				
				// Fallback: try simpler pattern
				if ( empty( $matches[0] ) ) {
					preg_match( '/<img[^>]*class="[^"]*wp-block-cover[^"]*"[^"]*>/i', $block_content, $matches );
				}
				
				// Another fallback: just get the first img tag
				if ( empty( $matches[0] ) ) {
					preg_match( '/<img[^>]*>/i', $block_content, $matches );
				}
				
				if ( ! empty( $matches[0] ) ) {
					$desktop_image_html = $matches[0];
					
					// Add fetchpriority if enabled
					if ( $high_fetch_priority && strpos( $desktop_image_html, 'fetchpriority' ) === false ) {
						$desktop_image_html = preg_replace( '/(<img[^>]*)(>)/i', '$1 fetchpriority="high"$2', $desktop_image_html, 1 );
					}
					
					// Get desktop srcset
					$desktop_srcset = $tag_processor->get_attribute( 'srcset' );
					if ( ! $desktop_srcset && $desktop_image_id > 0 ) {
						$desktop_srcset = wp_get_attachment_image_srcset( $desktop_image_id );
					}
					// If still no srcset, try to extract from the img tag
					if ( ! $desktop_srcset ) {
						preg_match( '/srcset="([^"]*)"/i', $desktop_image_html, $srcset_match );
						if ( ! empty( $srcset_match[1] ) ) {
							$desktop_srcset = $srcset_match[1];
						}
					}
					
					// Get desktop image width for sizes attribute
					$desktop_image_width = 0;
					// Try to get width from img tag
					preg_match( '/width="(\d+)"/i', $desktop_image_html, $width_match );
					if ( ! empty( $width_match[1] ) ) {
						$desktop_image_width = (int) $width_match[1];
					}
					// Fallback: get from attachment if we have ID
					if ( ! $desktop_image_width && $desktop_image_id > 0 ) {
						$desktop_image_data = wp_get_attachment_image_src( $desktop_image_id, 'full' );
						if ( $desktop_image_data && isset( $desktop_image_data[1] ) ) {
							$desktop_image_width = $desktop_image_data[1];
						}
					}
					// Fallback: use large size default
					if ( ! $desktop_image_width ) {
						$desktop_image_width = (int) get_option( 'large_size_w', 1024 );
					}
					
					// Build sizes attributes based on image widths
					$mobile_sizes = '100vw';
					if ( $mobile_image_width > 0 ) {
						$mobile_sizes = sprintf( '(max-width: %dpx) 100vw, %dpx', $mobile_image_width, $mobile_image_width );
					}
					
					$desktop_sizes = '100vw';
					if ( $desktop_image_width > 0 ) {
						$desktop_sizes = sprintf( '(max-width: %dpx) 100vw, %dpx', $desktop_image_width, $desktop_image_width );
					}
					
					// Create picture element with sources
					$picture_html = '<picture class="wp-block-cover__image-background">';
					
					// Mobile source (max-width: 782px)
					if ( $mobile_srcset ) {
						$picture_html .= '<source media="(max-width: 782px)" srcset="' . esc_attr( $mobile_srcset ) . '" sizes="' . esc_attr( $mobile_sizes ) . '">';
					} elseif ( $mobile_image_src && isset( $mobile_image_src[0] ) ) {
						$picture_html .= '<source media="(max-width: 782px)" srcset="' . esc_url( $mobile_image_src[0] ) . '" sizes="' . esc_attr( $mobile_sizes ) . '">';
					}
					
					// Desktop source (min-width: 783px)
					if ( $desktop_srcset ) {
						$picture_html .= '<source media="(min-width: 783px)" srcset="' . esc_attr( $desktop_srcset ) . '" sizes="' . esc_attr( $desktop_sizes ) . '">';
					}
					
					// Fallback img (desktop image)
					// Add data attributes for object position switching
					$desktop_img_with_attrs = $desktop_image_html;
					
					// Extract existing style attribute if present
					$existing_style = '';
					if ( preg_match( '/style="([^"]*)"/i', $desktop_img_with_attrs, $style_match ) ) {
						$existing_style = $style_match[1];
					}
					
					// Add or update data-object-position for mobile
					if ( strpos( $desktop_img_with_attrs, 'data-object-position' ) === false ) {
						$desktop_img_with_attrs = preg_replace(
							'/(<img[^>]*)(>)/i',
							'$1 data-object-position="' . esc_attr( $mobile_object_position ) . '"$2',
							$desktop_img_with_attrs,
							1
						);
					} else {
						$desktop_img_with_attrs = preg_replace(
							'/data-object-position="[^"]*"/i',
							'data-object-position="' . esc_attr( $mobile_object_position ) . '"',
							$desktop_img_with_attrs,
							1
						);
					}
					
					// Add data-desktop-object-position
					if ( strpos( $desktop_img_with_attrs, 'data-desktop-object-position' ) === false ) {
						$desktop_img_with_attrs = preg_replace(
							'/(<img[^>]*)(>)/i',
							'$1 data-desktop-object-position="' . esc_attr( $desktop_object_position ) . '"$2',
							$desktop_img_with_attrs,
							1
						);
					} else {
						$desktop_img_with_attrs = preg_replace(
							'/data-desktop-object-position="[^"]*"/i',
							'data-desktop-object-position="' . esc_attr( $desktop_object_position ) . '"',
							$desktop_img_with_attrs,
							1
						);
					}
					
					// Set initial style with mobile position (will be updated by JS)
					$style_attr = 'style="object-position:' . esc_attr( $mobile_object_position ) . ';';
					if ( $existing_style ) {
						// Preserve existing style but update object-position
						$existing_style = preg_replace( '/object-position:[^;]*;?/i', '', $existing_style );
						$style_attr .= ' ' . esc_attr( trim( $existing_style ) );
					}
					$style_attr .= '"';
					
					if ( strpos( $desktop_img_with_attrs, 'style=' ) === false ) {
						$desktop_img_with_attrs = preg_replace(
							'/(<img[^>]*)(>)/i',
							'$1 ' . $style_attr . '$2',
							$desktop_img_with_attrs,
							1
						);
					} else {
						$desktop_img_with_attrs = preg_replace(
							'/style="[^"]*"/i',
							$style_attr,
							$desktop_img_with_attrs,
							1
						);
					}
					
					$picture_html .= $desktop_img_with_attrs;
					$picture_html .= '</picture>';

					// Replace desktop image with picture element
					$block_content = str_replace( $matches[0], $picture_html, $block_content );
				}
				break;
			}
		}
	} else {
		// Fallback: use WP_HTML_Tag_Processor for simple modifications
		$tag_processor = new WP_HTML_Tag_Processor( $block_content );
		
		// Add class to desktop image and fetchpriority
		while ( $tag_processor->next_tag( array( 'tag_name' => 'IMG' ) ) ) {
			$class = $tag_processor->get_attribute( 'class' );
			if ( $class && strpos( $class, 'wp-block-cover__image-background' ) !== false ) {
				if ( strpos( $class, 'mosne-hero-desktop-image' ) === false ) {
					$tag_processor->add_class( 'mosne-hero-desktop-image' );
				}
				
				// Add fetchpriority if enabled
				if ( $high_fetch_priority && ! $tag_processor->get_attribute( 'fetchpriority' ) ) {
					$tag_processor->set_attribute( 'fetchpriority', 'high' );
				}
			}
		}
		
		$block_content = $tag_processor->get_updated_html();

		// Add mobile image if it exists (fallback when only mobile image, no desktop)
		if ( $mobile_image_id > 0 && $desktop_image_id === 0 ) {
			$mobile_image_attrs = array(
				'class'           => 'mosne-hero-mobile-image wp-block-cover__image-background wp-image-' . $mobile_image_id . ' size-' . $mobile_image_size,
				'data-object-fit' => 'cover',
				'alt'             => $alt_text,
				'data-object-position' => $mobile_object_position,
				'data-desktop-object-position' => $desktop_object_position,
				'style'           => 'object-position:' . esc_attr( $mobile_object_position ) . ';',
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

			// Insert mobile image before desktop image
			$tag_processor = new WP_HTML_Tag_Processor( $block_content );
			while ( $tag_processor->next_tag( array( 'tag_name' => 'IMG' ) ) ) {
				$class = $tag_processor->get_attribute( 'class' );
				if ( $class && ( strpos( $class, 'mosne-hero-desktop-image' ) !== false || strpos( $class, 'wp-block-cover__image-background' ) !== false ) ) {
					// Find position and insert mobile image before
					preg_match( '/<img[^>]*class="[^"]*' . preg_quote( str_replace( ' ', '.*', $class ), '/' ) . '[^"]*"[^"]*>/i', $block_content, $img_matches, PREG_OFFSET_CAPTURE );
					if ( ! empty( $img_matches[0] ) ) {
						$insert_pos = $img_matches[0][1];
						$block_content = substr_replace( $block_content, $mobile_image_html, $insert_pos, 0 );
					}
					break;
				}
			}
		}
	}

	return $block_content;
}
add_filter( 'render_block_core/cover', 'mosne_hero_render_cover_block', 10, 2 );
