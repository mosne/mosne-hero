<?php
/**
 * Assets enqueuing handler.
 *
 * @package MosneHero
 * @since 0.1.1
 */

namespace Mosne\Hero;

use function FakerPress\register;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Assets enqueuing class.
 *
 * @since 0.1.1
 */
class Assets {

	/**
	 * Constructor.
	 *
	 * @since 0.1.1
	 */
	public function __construct() {
		add_action( 'enqueue_block_editor_assets', [ $this, 'enqueue_editor_assets' ] );
		add_action( 'init', [ $this, 'register_frontend_script' ] );
		add_action( 'render_block_core/cover', [ $this, 'enqueue_frontend_script' ], 10, 2 );
	}

	/**
	 * Enqueue block editor assets (scripts only).
	 * Styles are handled via import in JavaScript for proper iframe loading.
	 *
	 * @since 0.1.1
	 *
	 * @return void
	 */
	public function enqueue_editor_assets() {
		$asset_file = include MOSNE_HERO_PLUGIN_DIR . 'build/index.asset.php';

		wp_enqueue_script(
			'mosne-hero-editor',
			MOSNE_HERO_PLUGIN_URL . 'build/index.js',
			$asset_file['dependencies'],
			$asset_file['version'],
			true
		);

		// Note: Image sizes are now retrieved from WordPress block editor settings
		// using wp.data.select('core/block-editor').getSettings().imageSizes in JavaScript.
	}


	/**
	 * Enqueue frontend script for focal point switching.
	 *
	 * @since 0.1.1
	 *
	 * @return string
	 */
	public function register_frontend_script() {

		// get ash form the asstes.php file
		$asset_file   = include MOSNE_HERO_PLUGIN_DIR . 'build/frontend.asset.php';
		$dependencies = $asset_file['dependencies'];
		$version      = $asset_file['version'];

		// register the script
		wp_register_script(
			'mosne-hero-frontend',
			MOSNE_HERO_PLUGIN_URL . 'build/frontend.js',
			$dependencies,
			$version,
			[
				'in_footer' => true,
				'strategy'  => 'defer',
			]

		);

		// Register video script with its own asset file
		$video_asset_file   = include MOSNE_HERO_PLUGIN_DIR . 'build/frontend-video.asset.php';
		$video_dependencies = $video_asset_file['dependencies'];
		$video_version      = $video_asset_file['version'];

		wp_register_script(
			'mosne-hero-frontend-video',
			MOSNE_HERO_PLUGIN_URL . 'build/frontend-video.js',
			$video_dependencies,
			$video_version,
			[
				'in_footer' => true,
				'strategy'  => 'defer',
			]
		);

		// Get breakpoint from settings.
		$breakpoint = 728; // Default fallback.
		if ( class_exists( __NAMESPACE__ . '\\Hero' ) ) {
			$plugin = Hero::get_instance();
			if ( isset( $plugin->settings ) ) {
				$breakpoint = $plugin->settings->get_breakpoint();
			}
		}

		// Localize breakpoint for JavaScript.
		wp_localize_script(
			'mosne-hero-frontend',
			'mosneHeroSettings',
			[
				'breakpoint' => $breakpoint,
			]
		);

		// Localize breakpoint for video script.
		wp_localize_script(
			'mosne-hero-frontend-video',
			'mosneHeroSettings',
			[
				'breakpoint' => $breakpoint,
			]
		);
	}

	/**
	 * Enqueue frontend script for focal point switching.
	 *
	 * @since 0.1.1
	 *
	 * @return string
	 */
	public function enqueue_frontend_script( $block_content, $block ): string {
		static $enqueued = false;
		static $video_enqueued = false;

		// only enqueue the assets if the cover block variation is used and if not already enqueued
		if ( ! $enqueued && isset( $block['attrs']['variation'] ) && 'mosne-hero-cover' === $block['attrs']['variation'] ) {
			wp_enqueue_script( 'mosne-hero-frontend' );
			$enqueued = true;
		}

		// Enqueue video script for video variation
		if ( ! $video_enqueued && isset( $block['attrs']['variation'] ) && 'mosne-hero-video' === $block['attrs']['variation'] ) {
			wp_enqueue_script( 'mosne-hero-frontend-video' );
			$video_enqueued = true;
		}

		return $block_content;
	}
}
