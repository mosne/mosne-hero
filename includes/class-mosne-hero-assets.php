<?php
/**
 * Assets enqueuing handler.
 *
 * @package MosneHero
 * @since 0.1.1
 */

namespace Mosne\Hero;

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
		add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_editor_assets' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_frontend_script' ) );
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
	 * @return void
	 */
	public function enqueue_frontend_script() {
		// Only enqueue on singular pages where blocks might be used.
		if ( ! is_singular() ) {
			return;
		}

		$frontend_file = MOSNE_HERO_PLUGIN_DIR . 'build/frontend.js';
		if ( ! file_exists( $frontend_file ) ) {
			return;
		}

		// Get breakpoint from settings.
		$breakpoint = 728; // Default fallback.
		if ( class_exists( __NAMESPACE__ . '\\Hero' ) ) {
			$plugin = Hero::get_instance();
			if ( isset( $plugin->settings ) ) {
				$breakpoint = $plugin->settings->get_breakpoint();
			}
		}

		wp_enqueue_script(
			'mosne-hero-frontend',
			MOSNE_HERO_PLUGIN_URL . 'build/frontend.js',
			array(),
			filemtime( $frontend_file ),
			true
		);

		// Localize breakpoint for JavaScript.
		wp_localize_script(
			'mosne-hero-frontend',
			'mosneHeroSettings',
			array(
				'breakpoint' => $breakpoint,
			)
		);
	}
}
