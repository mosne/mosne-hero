<?php
/**
 * Plugin Name:       Mosne Hero
 * Description:       Extends core/cover block with separate mobile and desktop background images.
 * Version:           0.1.0
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
	}

	return $metadata;
}
add_filter( 'block_type_metadata', 'mosne_hero_register_cover_attributes' );

/**
 * Enqueue block editor assets.
 *
 * @return void
 */
function mosne_hero_enqueue_assets() {
	$asset_file = include plugin_dir_path( __FILE__ ) . 'build/index.asset.php';

	wp_enqueue_script(
		'mosne-hero-editor',
		plugin_dir_url( __FILE__ ) . 'build/index.js',
		$asset_file['dependencies'],
		$asset_file['version'],
		true
	);

	wp_enqueue_style(
		'mosne-hero-style',
		plugin_dir_url( __FILE__ ) . 'build/style-index.css',
		array(),
		$asset_file['version']
	);
}
add_action( 'enqueue_block_editor_assets', 'mosne_hero_enqueue_assets' );
add_action( 'wp_enqueue_scripts', 'mosne_hero_enqueue_assets' );

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

	// If no mobile image, return as-is
	if ( ! $mobile_image_id ) {
		return $block_content;
	}

	// If we have an ID, use wp_get_attachment_image to get the full WordPress image markup
	if ( $mobile_image_id ) {
		// Calculate object-position from focal point
		$object_position = '50% 50%';
		if ( isset( $mobile_focal_point['x'] ) && isset( $mobile_focal_point['y'] ) ) {
			$object_position = ( $mobile_focal_point['x'] * 100 ) . '% ' . ( $mobile_focal_point['y'] * 100 ) . '%';
		}

		// Get alt text - use custom alt if provided, otherwise use attachment alt
		$alt_text = $mobile_image_alt;
		if ( empty( $alt_text ) ) {
			$alt_text = get_post_meta( $mobile_image_id, '_wp_attachment_image_alt', true );
		}
		if ( empty( $alt_text ) ) {
			$alt_text = '';
		}

		// Get the image with all WordPress attributes (srcset, sizes, etc.)
		$mobile_image_html = wp_get_attachment_image(
			$mobile_image_id,
			$mobile_image_size,
			false,
			array(
				'class'           => 'mosne-hero-mobile-image wp-block-cover__image-background wp-image-' . $mobile_image_id . ' size-' . $mobile_image_size,
				'data-object-fit' => 'cover',
				'alt'             => $alt_text,
				'data-object-position' => $object_position,
				'style'           => 'object-position:' . esc_attr( $object_position ) . ';',
			)
		);
	} else {
		return $block_content;
	}

	// Add class to cover block wrapper
	// Handle different HTML structures WordPress might generate
	if ( strpos( $block_content, 'has-mobile-image' ) === false ) {
		// Try to add class to the main wp-block-cover div
		$block_content = preg_replace(
			'/(<div[^>]*class=")([^"]*wp-block-cover[^"]*)([^"]*")/i',
			'$1$2 has-mobile-image$3',
			$block_content,
			1
		);
		
		// If that didn't work, try adding it to any div with wp-block-cover
		if ( strpos( $block_content, 'has-mobile-image' ) === false ) {
			$block_content = preg_replace(
				'/(<div[^>]*class="[^"]*wp-block-cover)/i',
				'$1 has-mobile-image',
				$block_content,
				1
			);
		}
	}

	// Find the desktop image and add class to it
	// Look for img tag with wp-block-cover__image-background class (desktop image)
	if ( strpos( $block_content, 'mosne-hero-desktop-image' ) === false ) {
		// First, add class to existing desktop image
		$block_content = preg_replace(
			'/(<img[^>]*class=")([^"]*wp-block-cover__image-background)([^"]*")/i',
			'$1mosne-hero-desktop-image $2$3',
			$block_content,
			1
		);
	}

	// Add mobile image BEFORE desktop image (only if not already added)
	if ( strpos( $block_content, 'mosne-hero-mobile-image' ) === false ) {
		// Try to insert before the desktop image
		$pattern = '/(<img[^>]*class="[^"]*mosne-hero-desktop-image[^"]*"[^>]*>)/i';
		if ( preg_match( $pattern, $block_content ) ) {
			$block_content = preg_replace( $pattern, $mobile_image_html . '$1', $block_content, 1 );
		} else {
			// Fallback: insert before any wp-block-cover__image-background
			$pattern = '/(<img[^>]*class="[^"]*wp-block-cover__image-background[^"]*"[^>]*>)/i';
			$block_content = preg_replace( $pattern, $mobile_image_html . '$1', $block_content, 1 );
		}
	}

	return $block_content;
}
add_filter( 'render_block_core/cover', 'mosne_hero_render_cover_block', 10, 2 );
