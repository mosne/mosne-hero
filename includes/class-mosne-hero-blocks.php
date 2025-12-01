<?php
/**
 * Block registration and attributes handler.
 *
 * @package MosneHero
 * @since 0.1.1
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Block registration and attributes class.
 *
 * @since 0.1.1
 */
class Mosne_Hero_Blocks {

	/**
	 * Constructor.
	 *
	 * @since 0.1.1
	 */
	public function __construct() {
		add_filter( 'block_type_metadata', array( $this, 'register_cover_attributes' ) );
		add_filter( 'block_editor_settings_all', array( $this, 'add_image_sizes_to_editor' ), 10, 1 );
	}

	/**
	 * Register additional attributes for core/cover block.
	 *
	 * @since 0.1.1
	 *
	 * @param array $metadata Block metadata.
	 * @return array Modified metadata.
	 */
	public function register_cover_attributes( $metadata ) {
		if ( 'core/cover' !== $metadata['name'] ) {
			return $metadata;
		}

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
			'type'    => 'boolean',
			'default' => false,
		);

		return $metadata;
	}

	/**
	 * Add custom image sizes to block editor settings.
	 *
	 * @since 0.1.1
	 *
	 * @param array $editor_settings Block editor settings.
	 * @return array Modified editor settings.
	 */
	public function add_image_sizes_to_editor( $editor_settings ) {
		// Ensure imageSizes array exists.
		if ( ! isset( $editor_settings['imageSizes'] ) ) {
			$editor_settings['imageSizes'] = array();
		}

		// Add custom hero mobile sizes.
		$editor_settings['imageSizes'][] = array(
			'slug'   => 'mosne-hero-mobile-retina',
			'name'   => __( 'Hero Mobile', 'mosne-hero' ),
			'width'  => 414,
			'height' => 736,
		);

		return $editor_settings;
	}
}

