<?php
/**
 * Main plugin class.
 *
 * @package MosneHero
 * @since 0.1.1
 */

namespace Mosne\Hero;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Main plugin class.
 *
 * @since 0.1.1
 */
class Hero {

	/**
	 * Plugin instance.
	 *
	 * @since 0.1.1
	 * @var Hero
	 */
	private static $instance = null;

	/**
	 * Blocks handler instance.
	 *
	 * @since 0.1.1
	 * @var Blocks
	 */
	public $blocks;

	/**
	 * Assets handler instance.
	 *
	 * @since 0.1.1
	 * @var Assets
	 */
	public $assets;

	/**
	 * Render handler instance.
	 *
	 * @since 0.1.1
	 * @var Render
	 */
	public $render;

	/**
	 * Settings handler instance.
	 *
	 * @since 0.1.2
	 * @var Settings
	 */
	public $settings;

	/**
	 * Get plugin instance.
	 *
	 * @since 0.1.1
	 *
	 * @return Hero Plugin instance.
	 */
	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Constructor.
	 *
	 * @since 0.1.1
	 */
	private function __construct() {
		$this->load_dependencies();
		$this->init();
	}

	/**
	 * Load required files.
	 *
	 * @since 0.1.1
	 *
	 * @return void
	 */
	private function load_dependencies() {
		require_once MOSNE_HERO_PLUGIN_DIR . 'includes/class-mosne-hero-blocks.php';
		require_once MOSNE_HERO_PLUGIN_DIR . 'includes/class-mosne-hero-assets.php';
		require_once MOSNE_HERO_PLUGIN_DIR . 'includes/class-mosne-hero-render.php';
		require_once MOSNE_HERO_PLUGIN_DIR . 'includes/class-mosne-hero-helpers.php';
		require_once MOSNE_HERO_PLUGIN_DIR . 'includes/class-mosne-hero-settings.php';
	}

	/**
	 * Initialize plugin components.
	 *
	 * @since 0.1.1
	 *
	 * @return void
	 */
	private function init() {
		// Initialize settings first.
		$this->settings = new Settings();

		// Register image sizes if enabled.
		if ( $this->settings->is_image_size_enabled() ) {
			$mobile_width = $this->settings->get_mobile_width();
			$mobile_height = $this->settings->get_mobile_height();
			// Retina dimensions are calculated as 2x mobile dimensions.
			$mobile_retina_width = $this->settings->get_mobile_retina_width();
			$mobile_retina_height = $this->settings->get_mobile_retina_height();
			$crop = $this->settings->get_crop();

			add_image_size( 'mosne-hero-mobile', $mobile_width, $mobile_height, $crop );
			add_image_size( 'mosne-hero-mobile-retina', $mobile_retina_width, $mobile_retina_height, $crop );
		}

		// Initialize components.
		$this->blocks = new Blocks();
		$this->assets = new Assets();
		$this->render = new Render();
	}

	/**
	 * Get plugin version.
	 *
	 * @since 0.1.1
	 *
	 * @return string Plugin version.
	 */
	public function get_version() {
		return defined( 'MOSNE_HERO_VERSION' ) ? MOSNE_HERO_VERSION : '0.1.1';
	}
}

