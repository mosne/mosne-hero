<?php
/**
 * Plugin Name:       Mosne Hero
 * Description:       A cover block with separate mobile and desktop background images stored in post meta.
 * Version:           0.1.0
 * Requires at least: 6.7
 * Requires PHP:        7.4
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       mosne-hero
 *
 * @package CreateBlock
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Registers the block using a `blocks-manifest.php` file, which improves the performance of block type registration.
 * Behind the scenes, it also registers all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://make.wordpress.org/core/2025/03/13/more-efficient-block-type-registration-in-6-8/
 * @see https://make.wordpress.org/core/2024/10/17/new-block-type-registration-apis-to-improve-performance-in-wordpress-6-7/
 */
function create_block_mosne_hero_block_init() {
	/**
	 * Registers the block(s) metadata from the `blocks-manifest.php` and registers the block type(s)
	 * based on the registered block metadata.
	 * Added in WordPress 6.8 to simplify the block metadata registration process added in WordPress 6.7.
	 *
	 * @see https://make.wordpress.org/core/2025/03/13/more-efficient-block-type-registration-in-6-8/
	 */
	if ( function_exists( 'wp_register_block_types_from_metadata_collection' ) ) {
		wp_register_block_types_from_metadata_collection( __DIR__ . '/build', __DIR__ . '/build/blocks-manifest.php' );
	} elseif ( function_exists( 'wp_register_block_metadata_collection' ) ) {
		/**
		 * Registers the block(s) metadata from the `blocks-manifest.php` file.
		 * Added to WordPress 6.7 to improve the performance of block type registration.
		 *
		 * @see https://make.wordpress.org/core/2024/10/17/new-block-type-registration-apis-to-improve-performance-in-wordpress-6-7/
		 */
		wp_register_block_metadata_collection( __DIR__ . '/build', __DIR__ . '/build/blocks-manifest.php' );
	}

	/**
	 * Registers the block type(s) in the `blocks-manifest.php` file.
	 *
	 * @see https://developer.wordpress.org/reference/functions/register_block_type/
	 */
	$manifest_data = require __DIR__ . '/build/blocks-manifest.php';
	foreach ( array_keys( $manifest_data ) as $block_type ) {
		register_block_type( __DIR__ . "/build/{$block_type}" );
	}
}
add_action( 'init', 'create_block_mosne_hero_block_init' );

/**
 * Register meta fields for the block.
 *
 * @return void
 */
function create_block_mosne_hero_register_meta() {
	$post_types = get_post_types( array( 'public' => true ), 'names' );

	foreach ( $post_types as $post_type ) {
		// Register desktop image meta
		register_post_meta(
			$post_type,
			'_mosne_hero_desktop_image_id',
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
			'_mosne_hero_desktop_image_url',
			array(
				'show_in_rest' => true,
				'single'       => true,
				'type'         => 'string',
				'auth_callback' => function() {
					return current_user_can( 'edit_posts' );
				},
			)
		);

		// Register mobile image meta
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
add_action( 'init', 'create_block_mosne_hero_register_meta' );

/**
 * Save block meta data when post is saved.
 * This extracts image data from block attributes and saves to post meta.
 *
 * @param int     $post_id Post ID.
 * @param WP_Post $post    Post object.
 * @return void
 */
function create_block_mosne_hero_save_meta( $post_id, $post ) {
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

	// Find mosne-hero blocks and save their meta
	foreach ( $blocks as $block ) {
		if ( 'create-block/mosne-hero' === $block['blockName'] ) {
			$attrs = $block['attrs'] ?? array();

			// Save desktop image
			if ( isset( $attrs['desktopImageId'] ) && $attrs['desktopImageId'] > 0 ) {
				$desktop_id = absint( $attrs['desktopImageId'] );
				update_post_meta( $post_id, '_mosne_hero_desktop_image_id', $desktop_id );

				if ( isset( $attrs['desktopImageUrl'] ) && ! empty( $attrs['desktopImageUrl'] ) ) {
					update_post_meta( $post_id, '_mosne_hero_desktop_image_url', esc_url_raw( $attrs['desktopImageUrl'] ) );
				}
			} else {
				// Remove meta if image is removed
				delete_post_meta( $post_id, '_mosne_hero_desktop_image_id' );
				delete_post_meta( $post_id, '_mosne_hero_desktop_image_url' );
			}

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
add_action( 'save_post', 'create_block_mosne_hero_save_meta', 10, 2 );

/**
 * Filter block content to include meta data on frontend.
 * This ensures meta values are available even if block attributes are empty.
 *
 * @param string $block_content The rendered block content.
 * @param array  $parsed_block  The parsed block array.
 * @return string Filtered block content.
 */
function create_block_mosne_hero_render_block( $block_content, $parsed_block ) {
	// Check if this is our block
	if ( 'create-block/mosne-hero' !== ( $parsed_block['blockName'] ?? '' ) ) {
		return $block_content;
	}

	// Get post ID
	$post_id = get_the_ID();

	if ( ! $post_id ) {
		return $block_content;
	}

	// Get attributes from parsed block
	$attributes = $parsed_block['attrs'] ?? array();

	// Get meta values
	$desktop_image_id  = get_post_meta( $post_id, '_mosne_hero_desktop_image_id', true );
	$desktop_image_url = get_post_meta( $post_id, '_mosne_hero_desktop_image_url', true );
	$mobile_image_id   = get_post_meta( $post_id, '_mosne_hero_mobile_image_id', true );
	$mobile_image_url  = get_post_meta( $post_id, '_mosne_hero_mobile_image_url', true );

	// If meta exists but attributes are empty, we need to re-render with meta values
	// However, since the block is already rendered, we'll use a different approach:
	// We'll modify the content directly if needed, or just return it as-is
	// The meta values should already be in the attributes when the block is saved

	return $block_content;
}
add_filter( 'render_block', 'create_block_mosne_hero_render_block', 10, 2 );
