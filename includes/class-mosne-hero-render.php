<?php
/**
 * Block rendering handler.
 *
 * @package MosneHero
 * @since 0.1.1
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Block rendering class.
 *
 * @since 0.1.1
 */
class Mosne_Hero_Render {

	/**
	 * Constructor.
	 *
	 * @since 0.1.1
	 */
	public function __construct() {
		add_filter( 'render_block_core/cover', array( $this, 'render_cover_block' ), 10, 2 );
	}

	/**
	 * Filter cover block output to add mobile image support.
	 *
	 * This function extends the core/cover block to support separate mobile and desktop
	 * background images with responsive picture element markup.
	 *
	 * @since 0.1.1
	 *
	 * @param string $block_content The rendered block content.
	 * @param array  $parsed_block  The parsed block array.
	 * @return string Filtered block content.
	 */
	public function render_cover_block( $block_content, $parsed_block ) {
		// Early return if not a core/cover block.
		if ( 'core/cover' !== ( $parsed_block['blockName'] ?? '' ) ) {
			return $block_content;
		}

		$attributes = $parsed_block['attrs'] ?? array();

		// Early return if not our variation.
		if ( ! isset( $attributes['variation'] ) || 'mosne-hero-cover' !== $attributes['variation'] ) {
			return $block_content;
		}

		// Extract and validate attributes.
		$mobile_image_id    = isset( $attributes['mobileImageId'] ) ? absint( $attributes['mobileImageId'] ) : 0;
		$mobile_focal_point = $attributes['mobileFocalPoint'] ?? array( 'x' => 0.5, 'y' => 0.5 );
		$mobile_image_size  = isset( $attributes['mobileImageSize'] ) ? sanitize_text_field( $attributes['mobileImageSize'] ) : 'large';
		$mobile_image_alt   = isset( $attributes['mobileImageAlt'] ) ? sanitize_text_field( $attributes['mobileImageAlt'] ) : '';
		$high_fetch_priority = ! empty( $attributes['highFetchPriority'] );

		// Get desktop image ID (supports featured image).
		$desktop_image_id = Mosne_Hero_Helpers::get_desktop_image_id( $attributes );

		// Early return if no images available.
		if ( ! $mobile_image_id && ! $desktop_image_id ) {
			return $block_content;
		}

		// Handle case where desktop image is used for mobile.
		$use_desktop_for_mobile = ( ! $mobile_image_id && $desktop_image_id > 0 );
		if ( $use_desktop_for_mobile ) {
			$mobile_image_id = $desktop_image_id;
			if ( ! isset( $attributes['mobileFocalPoint'] ) ) {
				$mobile_focal_point = $attributes['focalPoint'] ?? array( 'x' => 0.5, 'y' => 0.5 );
			}
		}

		// Convert focal points to CSS positions.
		$mobile_object_position  = Mosne_Hero_Helpers::focal_point_to_position( $mobile_focal_point );
		$desktop_focal_point     = $attributes['focalPoint'] ?? array( 'x' => 0.5, 'y' => 0.5 );
		$desktop_object_position = Mosne_Hero_Helpers::focal_point_to_position( $desktop_focal_point );

		// Get mobile alt text with fallback.
		$mobile_alt_text = Mosne_Hero_Helpers::get_alt_text( $mobile_image_alt, $mobile_image_id, $desktop_image_id );

		// Get desktop alt text from block attribute, with fallback to attachment meta.
		$desktop_alt_text = Mosne_Hero_Helpers::get_desktop_alt_text( $attributes, $desktop_image_id );

		// Get mobile image data.
		$actual_mobile_image_id = $use_desktop_for_mobile ? $desktop_image_id : $mobile_image_id;
		$mobile_srcset          = $actual_mobile_image_id > 0 ? wp_get_attachment_image_srcset( $actual_mobile_image_id, $mobile_image_size ) : '';
		$mobile_image_src       = $actual_mobile_image_id > 0 ? wp_get_attachment_image_src( $actual_mobile_image_id, $mobile_image_size ) : false;
		$mobile_image_width     = Mosne_Hero_Helpers::get_image_width( $mobile_image_size, $mobile_image_src );

		// Add wrapper class for mobile image support.
		$block_content = Mosne_Hero_Helpers::add_wrapper_class( $block_content );

		// Build picture element if we have both images or using desktop for mobile.
		if ( $desktop_image_id > 0 && ( $mobile_image_id > 0 || $use_desktop_for_mobile ) ) {
			$desktop_image_html = Mosne_Hero_Helpers::find_desktop_image( $block_content );

			if ( $desktop_image_html ) {
				// Get desktop image data.
				$desktop_srcset = wp_get_attachment_image_srcset( $desktop_image_id );
				if ( ! $desktop_srcset && preg_match( '/srcset="([^"]*)"/i', $desktop_image_html, $srcset_match ) ) {
					$desktop_srcset = $srcset_match[1];
				}

				$desktop_image_data = wp_get_attachment_image_src( $desktop_image_id, 'full' );
				$desktop_image_width = 0;
				if ( preg_match( '/width="(\d+)"/i', $desktop_image_html, $width_match ) ) {
					$desktop_image_width = (int) $width_match[1];
				} elseif ( $desktop_image_data && isset( $desktop_image_data[1] ) ) {
					$desktop_image_width = (int) $desktop_image_data[1];
				} else {
					$desktop_image_width = (int) get_option( 'large_size_w', 1024 );
				}

				// Get mobile src URL for fallback img tag.
				$mobile_src_url = '';
				if ( $mobile_image_src && isset( $mobile_image_src[0] ) ) {
					$mobile_src_url = $mobile_image_src[0];
				} elseif ( $mobile_srcset && preg_match( '/^([^,\s]+)/', $mobile_srcset, $srcset_url_match ) ) {
					$mobile_src_url = trim( $srcset_url_match[1] );
				}

				// Extract desktop alt from existing img tag if present (as additional fallback).
				$desktop_alt_from_html = '';
				if ( preg_match( '/alt="([^"]*)"/i', $desktop_image_html, $alt_match ) ) {
					$desktop_alt_from_html = sanitize_text_field( $alt_match[1] );
				}
				// Use block attribute alt first, then HTML alt, then attachment meta.
				$final_desktop_alt = ! empty( $desktop_alt_text ) ? $desktop_alt_text : ( ! empty( $desktop_alt_from_html ) ? $desktop_alt_from_html : '' );

				// Optimize img tag for picture element.
				$optimized_img = Mosne_Hero_Helpers::optimize_img_for_picture(
					$desktop_image_html,
					$mobile_src_url,
					$mobile_object_position,
					$desktop_object_position,
					$mobile_alt_text,
					$final_desktop_alt,
					$high_fetch_priority
				);

				// Build picture element.
				$picture_html = Mosne_Hero_Helpers::build_picture_element(
					array(
						'mobile_srcset'  => $mobile_srcset,
						'mobile_src'     => $mobile_image_src ? $mobile_image_src[0] : '',
						'mobile_sizes'  => Mosne_Hero_Helpers::build_sizes_attr( $mobile_image_width ),
						'desktop_srcset' => $desktop_srcset,
						'desktop_sizes'  => Mosne_Hero_Helpers::build_sizes_attr( $desktop_image_width ),
						'img_html'       => $optimized_img,
					)
				);

				// Replace desktop image with picture element.
				$block_content = str_replace( $desktop_image_html, $picture_html, $block_content );
			}
		} else {
			// Fallback: simple modifications when no picture element needed.
			if ( ! class_exists( 'WP_HTML_Tag_Processor' ) ) {
				return $block_content;
			}

			$tag_processor = new WP_HTML_Tag_Processor( $block_content );

			// Add class and fetchpriority to desktop image.
			while ( $tag_processor->next_tag( array( 'tag_name' => 'IMG' ) ) ) {
				$class = $tag_processor->get_attribute( 'class' );
				if ( $class && strpos( $class, 'wp-block-cover__image-background' ) !== false ) {
					if ( strpos( $class, 'mosne-hero-desktop-image' ) === false ) {
						$tag_processor->add_class( 'mosne-hero-desktop-image' );
					}

					if ( $high_fetch_priority && ! $tag_processor->get_attribute( 'fetchpriority' ) ) {
						$tag_processor->set_attribute( 'fetchpriority', 'high' );
					}
				}
			}

			$block_content = $tag_processor->get_updated_html();

			// Add mobile image if only mobile exists (no desktop).
			if ( $mobile_image_id > 0 && $desktop_image_id === 0 ) {
				$mobile_image_attrs = array(
					'class'                      => 'mosne-hero-mobile-image wp-block-cover__image-background wp-image-' . absint( $mobile_image_id ) . ' size-' . esc_attr( $mobile_image_size ),
					'data-object-fit'            => 'cover',
					'alt'                        => esc_attr( $mobile_alt_text ),
					'data-object-position'       => esc_attr( $mobile_object_position ),
					'data-desktop-object-position' => esc_attr( $desktop_object_position ),
					'data-desktop-alt'           => esc_attr( $desktop_alt_text ),
					'style'                      => 'object-position:' . esc_attr( $mobile_object_position ) . ';',
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

				// Insert mobile image before desktop image.
				$tag_processor = new WP_HTML_Tag_Processor( $block_content );
				while ( $tag_processor->next_tag( array( 'tag_name' => 'IMG' ) ) ) {
					$class = $tag_processor->get_attribute( 'class' );
					if ( $class && ( strpos( $class, 'mosne-hero-desktop-image' ) !== false || strpos( $class, 'wp-block-cover__image-background' ) !== false ) ) {
						$pattern = '/<img[^>]*class="[^"]*' . preg_quote( str_replace( ' ', '.*', $class ), '/' ) . '[^"]*"[^"]*>/i';
						if ( preg_match( $pattern, $block_content, $img_matches, PREG_OFFSET_CAPTURE ) ) {
							$block_content = substr_replace( $block_content, $mobile_image_html, $img_matches[0][1], 0 );
						}
						break;
					}
				}
			}
		}

		return $block_content;
	}
}

