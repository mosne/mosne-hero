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
		add_action( 'render_block', [ $this, 'enqueue_frontend_script' ], 10, 2 );
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
			MOSNE_HERO_PLUGIN_DIR . 'build/frontend.js',
			$dependencies,
			$version,
			true
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
	}

	/**
	 * Enqueue frontend script for focal point switching.
	 *
	 * @since 0.1.1
	 *
	 * @return string
	 */
	public function enqueue_frontend_script( $block_content, $block ): string {

		// only enqueue the assets if the cover block variation is used
		if ( has_block( 'core/cover' ) && 'mosne-hero-cover' === $block['attrs']['variation'] ) {
			wp_enqueue_script( 'mosne-hero-frontend' );
		}

		return $block_content;
	}
}
