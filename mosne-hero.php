<?php
/**
 * Plugin Name:       Mosne Hero
 * Description:       Extends core/cover block with separate mobile and desktop background images and sizes.
 * Version:           0.1.0
 * Author:            Mosne
 * Author URI: https://mosne.it
 * Requires at least: 6.7
 * Requires PHP:      7.4
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       mosne-hero
 *
 * @package MosneHero
 */

namespace Mosne\Hero;

// Define plugin constants.
if ( ! defined( 'WPINC' ) ) {
	die;
}

// Define plugin constants.
define( 'MOSNE_HERO_VERSION', '0.1.0' );
define( 'MOSNE_HERO_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'MOSNE_HERO_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

/**
 * Load the main plugin class.
 */
require_once MOSNE_HERO_PLUGIN_DIR . 'includes/class-mosne-hero.php';

/**
 * Initialize the plugin.
 *
 * @since 0.1.1
 *
 * @return Hero Plugin instance.
 */
function mosne_hero() {
	return Hero::get_instance();
}

// Initialize the plugin.
add_action( 'init', __NAMESPACE__ . '\\mosne_hero', 0 );
