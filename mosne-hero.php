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
 * Load the main plugin class.
 */
require_once plugin_dir_path( __FILE__ ) . 'includes/class-mosne-hero.php';

/**
 * Initialize the plugin.
 *
 * @since 0.1.1
 *
 * @return Mosne_Hero Plugin instance.
 */
function mosne_hero() {
	return Mosne_Hero::get_instance();
}

// Initialize the plugin.
mosne_hero();
