<?php
/**
 * Helper functions for block rendering.
 *
 * @package MosneHero
 * @since 0.1.1
 */

namespace Mosne\Hero;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Helper functions class.
 *
 * @since 0.1.1
 */
class Helpers {

	/**
	 * Get desktop image ID from block attributes, including featured image support.
	 *
	 * @since 0.1.1
	 *
	 * @param array $attributes Block attributes.
	 * @return int Desktop image ID, or 0 if not found.
	 */
	public static function get_desktop_image_id( $attributes ) {
		$desktop_image_id = isset( $attributes['id'] ) ? absint( $attributes['id'] ) : 0;

		// Use featured image if useFeaturedImage is enabled and no desktop image is set.
		if ( ! $desktop_image_id && ! empty( $attributes['useFeaturedImage'] ) ) {
			$post_id = get_the_ID();
			if ( $post_id ) {
				$thumbnail_id = get_post_thumbnail_id( $post_id );
				if ( $thumbnail_id > 0 ) {
					$desktop_image_id = $thumbnail_id;
				}
			}
		}

		return $desktop_image_id;
	}

	/**
	 * Convert focal point array to CSS object-position value.
	 *
	 * @since 0.1.1
	 *
	 * @param array $focal_point Focal point with 'x' and 'y' keys (0-1 range).
	 * @return string CSS object-position value (e.g., "50% 50%").
	 */
	public static function focal_point_to_position( $focal_point ) {
		if ( ! is_array( $focal_point ) || ! isset( $focal_point['x'] ) || ! isset( $focal_point['y'] ) ) {
			return '50% 50%';
		}

		$x = max( 0, min( 1, (float) $focal_point['x'] ) );
		$y = max( 0, min( 1, (float) $focal_point['y'] ) );

		return ( $x * 100 ) . '% ' . ( $y * 100 ) . '%';
	}

	/**
	 * Get image alt text, with fallback to attachment meta.
	 *
	 * @since 0.1.1
	 *
	 * @param string $custom_alt      Custom alt text from attributes.
	 * @param int    $mobile_image_id Mobile image ID.
	 * @param int    $desktop_image_id Desktop image ID.
	 * @return string Alt text, empty string if none found.
	 */
	public static function get_alt_text( $custom_alt, $mobile_image_id, $desktop_image_id ) {
		if ( ! empty( $custom_alt ) ) {
			return sanitize_text_field( $custom_alt );
		}

		// Try mobile image first, then desktop.
		$image_id = $mobile_image_id > 0 ? $mobile_image_id : $desktop_image_id;
		if ( $image_id > 0 ) {
			$alt = get_post_meta( $image_id, '_wp_attachment_image_alt', true );
			if ( ! empty( $alt ) ) {
				return sanitize_text_field( $alt );
			}
		}

		return '';
	}

	/**
	 * Get desktop alt text from block attributes, with fallback to attachment meta.
	 *
	 * @since 0.1.1
	 *
	 * @param array $attributes       Block attributes.
	 * @param int   $desktop_image_id Desktop image ID.
	 * @return string Alt text, empty string if none found.
	 */
	public static function get_desktop_alt_text( $attributes, $desktop_image_id ) {
		// First, check for alt attribute in block attributes.
		if ( isset( $attributes['alt'] ) && ! empty( $attributes['alt'] ) ) {
			return sanitize_text_field( $attributes['alt'] );
		}

		return '';
	}

	/**
	 * Get image width for a given size name.
	 *
	 * @since 0.1.1
	 *
	 * @param string $size_name Image size name.
	 * @param array  $image_src Optional. Image src array from wp_get_attachment_image_src().
	 * @return int Image width in pixels, or 0 if unknown.
	 */
	public static function get_image_width( $size_name, $image_src = null ) {
		// Try to get from registered sizes first.
		if ( function_exists( 'wp_get_registered_image_subsizes' ) ) {
			$size_info = wp_get_registered_image_subsizes();
			if ( isset( $size_info[ $size_name ]['width'] ) && $size_info[ $size_name ]['width'] > 0 ) {
				return (int) $size_info[ $size_name ]['width'];
			}
		}

		// Fallback: get from image src array.
		if ( $image_src && isset( $image_src[1] ) && $image_src[1] > 0 ) {
			return (int) $image_src[1];
		}

		// Fallback: use WordPress default sizes.
		$default_widths = array(
			'thumbnail'    => 150,
			'medium'       => 300,
			'medium_large' => 768,
			'large'        => 1024,
			'full'         => 1920,
		);

		if ( isset( $default_widths[ $size_name ] ) ) {
			$option_key = $size_name . '_size_w';
			if ( 'full' !== $size_name ) {
				return (int) get_option( $option_key, $default_widths[ $size_name ] );
			}
			return $default_widths[ $size_name ];
		}

		return 0;
	}

	/**
	 * Build sizes attribute for responsive images.
	 *
	 * @since 0.1.1
	 *
	 * @param int $image_width Image width in pixels.
	 * @return string Sizes attribute value.
	 */
	public static function build_sizes_attr( $image_width ) {
		if ( $image_width > 0 ) {
			return sprintf( '(max-width: %dpx) 100vw, %dpx', $image_width, $image_width );
		}
		return '100vw';
	}

	/**
	 * Find desktop image HTML in block content.
	 *
	 * @since 0.1.1
	 *
	 * @param string $block_content Block HTML content.
	 * @return string|false Image HTML tag, or false if not found.
	 */
	public static function find_desktop_image( $block_content ) {
		if ( ! class_exists( '\WP_HTML_Tag_Processor' ) ) {
			return false;
		}

		$tag_processor = new \WP_HTML_Tag_Processor( $block_content );

		while ( $tag_processor->next_tag( array( 'tag_name' => 'IMG' ) ) ) {
			$class = $tag_processor->get_attribute( 'class' );
			if ( ! $class ) {
				continue;
			}

			// Check for cover block image classes.
			if ( strpos( $class, 'wp-block-cover__image-background' ) !== false || strpos( $class, 'wp-image-' ) !== false ) {
				// Try to extract the full img tag using regex.
				$pattern = '/<img[^>]*class="[^"]*' . preg_quote( str_replace( ' ', '.*', $class ), '/' ) . '[^"]*"[^"]*>/i';
				if ( preg_match( $pattern, $block_content, $matches ) ) {
					return $matches[0];
				}

				// Fallback: simpler pattern.
				if ( preg_match( '/<img[^>]*class="[^"]*wp-block-cover[^"]*"[^"]*>/i', $block_content, $matches ) ) {
					return $matches[0];
				}

				// Last resort: first img tag.
				if ( preg_match( '/<img[^>]*>/i', $block_content, $matches ) ) {
					return $matches[0];
				}
			}
		}

		return false;
	}

	/**
	 * Optimize img tag for use inside picture element.
	 *
	 * Removes redundant srcset/sizes and sets src to mobile image URL.
	 *
	 * @since 0.1.1
	 *
	 * @param string $img_html         Original img HTML tag.
	 * @param string $mobile_src_url   Mobile image URL for src attribute.
	 * @param string $mobile_position  Mobile object position.
	 * @param string $desktop_position Desktop object position.
	 * @param string $mobile_alt       Mobile alt text.
	 * @param string $desktop_alt      Desktop alt text.
	 * @param bool   $high_priority    Whether to add fetchpriority="high".
	 * @param string $mobile_image_size Optional. Mobile image size slug. Default empty.
	 * @return string Optimized img HTML tag.
	 */
	public static function optimize_img_for_picture( $img_html, $mobile_src_url, $mobile_position, $desktop_position, $mobile_alt = '', $desktop_alt = '', $high_priority = false, $mobile_image_size = '' ) {
		// Remove redundant srcset and sizes attributes.
		$img_html = preg_replace( '/\s*(?:srcset|sizes)="[^"]*"/i', '', $img_html );

		// Replace size class with mobile image size class.
		if ( ! empty( $mobile_image_size ) ) {
			// Replace any size-* class with the mobile size class.
			$img_html = preg_replace( '/\bsize-[a-zA-Z0-9_-]+\b/', 'size-' . esc_attr( $mobile_image_size ), $img_html );
		}

		// Update or add src attribute with mobile URL.
		if ( $mobile_src_url ) {
			if ( preg_match( '/src="[^"]*"/i', $img_html ) ) {
				$img_html = preg_replace( '/src="[^"]*"/i', 'src="' . esc_url( $mobile_src_url ) . '"', $img_html );
			} else {
				$img_html = preg_replace( '/(<img[^>]*)(>)/i', '$1 src="' . esc_url( $mobile_src_url ) . '"$2', $img_html, 1 );
			}
		}

		// Extract and preserve existing style, removing object-position.
		$existing_style = '';
		if ( preg_match( '/style="([^"]*)"/i', $img_html, $style_match ) ) {
			$existing_style = preg_replace( '/object-position:[^;]*;?/i', '', $style_match[1] );
			$existing_style = trim( $existing_style );
		}

		// Build new style with mobile position.
		$style_value = 'object-position:' . esc_attr( $mobile_position );
		if ( $existing_style ) {
			$style_value .= '; ' . esc_attr( $existing_style );
		}

		// Update style attribute.
		if ( strpos( $img_html, 'style=' ) !== false ) {
			$img_html = preg_replace( '/style="[^"]*"/i', 'style="' . esc_attr( $style_value ) . '"', $img_html );
		} else {
			$img_html = preg_replace( '/(<img[^>]*)(>)/i', '$1 style="' . esc_attr( $style_value ) . '"$2', $img_html, 1 );
		}

		// Add or update data attributes for object position.
		$data_attrs = array(
			'data-object-position'         => esc_attr( $mobile_position ),
			'data-desktop-object-position' => esc_attr( $desktop_position ),
		);

		foreach ( $data_attrs as $attr_name => $attr_value ) {
			if ( strpos( $img_html, $attr_name ) !== false ) {
				$img_html = preg_replace( '/' . preg_quote( $attr_name, '/' ) . '="[^"]*"/i', $attr_name . '="' . $attr_value . '"', $img_html );
			} else {
				$img_html = preg_replace( '/(<img[^>]*)(>)/i', '$1 ' . $attr_name . '="' . $attr_value . '"$2', $img_html, 1 );
			}
		}

		// Add or update data-desktop-alt attribute.
		if ( ! empty( $desktop_alt ) ) {
			$desktop_alt_attr = 'data-desktop-alt="' . esc_attr( $desktop_alt ) . '"';
			if ( strpos( $img_html, 'data-desktop-alt' ) !== false ) {
				$img_html = preg_replace( '/data-desktop-alt="[^"]*"/i', $desktop_alt_attr, $img_html );
			} else {
				$img_html = preg_replace( '/(<img[^>]*)(>)/i', '$1 ' . $desktop_alt_attr . '$2', $img_html, 1 );
			}
		}

		// Set alt attribute to mobile alt (will be switched by JavaScript based on breakpoint).
		if ( ! empty( $mobile_alt ) ) {
			if ( strpos( $img_html, 'alt=' ) !== false ) {
				// Match only the alt attribute, not attributes containing "alt" like data-desktop-alt.
				// Use negative lookbehind to ensure "alt" is not preceded by word characters or hyphen.
				$img_html = preg_replace( '/(?<![\w-])alt="[^"]*"/i', 'alt="' . esc_attr( $mobile_alt ) . '"', $img_html );
			} else {
				$img_html = preg_replace( '/(<img[^>]*)(>)/i', '$1 alt="' . esc_attr( $mobile_alt ) . '"$2', $img_html, 1 );
			}
		}

		// Add fetchpriority if enabled.
		if ( $high_priority && strpos( $img_html, 'fetchpriority' ) === false ) {
			$img_html = preg_replace( '/(<img[^>]*)(>)/i', '$1 fetchpriority="high"$2', $img_html, 1 );
		}

		/**
		 * Filter the optimized img HTML tag.
		 *
		 * @since 0.1.2
		 *
		 * @param string $img_html         Optimized img HTML tag.
		 * @param string $mobile_src_url   Mobile image URL.
		 * @param string $mobile_position  Mobile object position.
		 * @param string $desktop_position Desktop object position.
		 * @param string $mobile_alt       Mobile alt text.
		 * @param string $desktop_alt      Desktop alt text.
		 * @param bool   $high_priority    Whether fetchpriority="high" is set.
		 * @param string $mobile_image_size Mobile image size slug.
		 * @return string Modified img HTML tag.
		 */
		return apply_filters( 'mosne_hero_optimized_img_html', $img_html, $mobile_src_url, $mobile_position, $desktop_position, $mobile_alt, $desktop_alt, $high_priority, $mobile_image_size );
	}

	/**
	 * Build picture element HTML with mobile and desktop sources.
	 *
	 * @since 0.1.1
	 *
	 * @param array $args {
	 *     Arguments for building the picture element.
	 *
	 *     @type string $mobile_srcset    Mobile image srcset.
	 *     @type string $mobile_src       Mobile image src URL.
	 *     @type string $mobile_sizes     Mobile sizes attribute.
	 *     @type string $desktop_srcset   Desktop image srcset.
	 *     @type string $desktop_sizes    Desktop sizes attribute.
	 *     @type string $img_html          Fallback img tag HTML.
	 * }
	 * @return string Picture element HTML.
	 */
	public static function build_picture_element( $args ) {
		$args = wp_parse_args(
			$args,
			array(
				'mobile_srcset'  => '',
				'mobile_src'     => '',
				'mobile_sizes'   => '100vw',
				'desktop_srcset' => '',
				'desktop_sizes'  => '100vw',
				'img_html'       => '',
			)
		);

		$picture_html = '<picture class="wp-block-cover__image-background">';

		// Get breakpoint from settings.
		$breakpoint = 728; // Default fallback.
		if ( class_exists( __NAMESPACE__ . '\\Hero' ) ) {
			$plugin = Hero::get_instance();
			if ( isset( $plugin->settings ) ) {
				$breakpoint = $plugin->settings->get_breakpoint();
			}
		}
		/**
		 * Filter breakpoint for picture element media queries.
		 *
		 * @since 0.1.2
		 *
		 * @param int $breakpoint Breakpoint in pixels.
		 * @return int Modified breakpoint.
		 */
		$breakpoint = apply_filters( 'mosne_hero_picture_breakpoint', $breakpoint );
		$desktop_min_width = $breakpoint + 1;

		// Mobile source.
		if ( ! empty( $args['mobile_srcset'] ) ) {
			$picture_html .= '<source media="(max-width: ' . esc_attr( $breakpoint ) . 'px)" srcset="' . esc_attr( $args['mobile_srcset'] ) . '" sizes="' . esc_attr( $args['mobile_sizes'] ) . '">';
		} elseif ( ! empty( $args['mobile_src'] ) ) {
			$picture_html .= '<source media="(max-width: ' . esc_attr( $breakpoint ) . 'px)" srcset="' . esc_url( $args['mobile_src'] ) . '" sizes="' . esc_attr( $args['mobile_sizes'] ) . '">';
		}

		// Desktop source.
		if ( ! empty( $args['desktop_srcset'] ) ) {
			$picture_html .= '<source media="(min-width: ' . esc_attr( $desktop_min_width ) . 'px)" srcset="' . esc_attr( $args['desktop_srcset'] ) . '" sizes="' . esc_attr( $args['desktop_sizes'] ) . '">';
		}

		// Fallback img tag.
		if ( ! empty( $args['img_html'] ) ) {
			$picture_html .= $args['img_html'];
		}

		$picture_html .= '</picture>';

		return $picture_html;
	}

	/**
	 * Add has-mobile-image class to cover block wrapper.
	 *
	 * @since 0.1.1
	 *
	 * @param string $block_content Block HTML content.
	 * @return string Modified block content.
	 */
	public static function add_wrapper_class( $block_content ) {
		if ( ! class_exists( '\WP_HTML_Tag_Processor' ) ) {
			return $block_content;
		}

		$tag_processor = new \WP_HTML_Tag_Processor( $block_content );

		while ( $tag_processor->next_tag( array( 'tag_name' => 'DIV' ) ) ) {
			$class = $tag_processor->get_attribute( 'class' );
			if ( $class && strpos( $class, 'wp-block-cover' ) !== false && strpos( $class, 'has-mobile-image' ) === false ) {
				$tag_processor->add_class( 'has-mobile-image' );
				break;
			}
		}

		return $tag_processor->get_updated_html();
	}
}

