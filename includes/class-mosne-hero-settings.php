<?php
/**
 * Settings page for Mosne Hero plugin.
 *
 * @package MosneHero
 * @since 0.1.2
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Settings class for Mosne Hero.
 *
 * @since 0.1.2
 */
class Mosne_Hero_Settings {

	/**
	 * Option group name.
	 *
	 * @since 0.1.2
	 * @var string
	 */
	const OPTION_GROUP = 'mosne_hero_settings';

	/**
	 * Option name.
	 *
	 * @since 0.1.2
	 * @var string
	 */
	const OPTION_NAME = 'mosne_hero_settings';

	/**
	 * Default settings.
	 *
	 * @since 0.1.2
	 * @var array
	 */
	private $defaults = array(
		'enable_image_size'        => true,
		'mobile_width'              => 414,
		'mobile_height'             => 736,
		'crop'                      => true,
		'breakpoint'                => 728,
	);

	/**
	 * Constructor.
	 *
	 * @since 0.1.2
	 */
	public function __construct() {
		add_action( 'admin_menu', array( $this, 'add_settings_page' ) );
		add_action( 'admin_init', array( $this, 'register_settings' ) );
	}

	/**
	 * Add settings page to WordPress admin.
	 *
	 * @since 0.1.2
	 *
	 * @return void
	 */
	public function add_settings_page() {
		add_options_page(
			__( 'Mosne Hero Mobile', 'mosne-hero' ),
			__( 'Mosne Hero Mobile', 'mosne-hero' ),
			'manage_options',
			'mosne-hero-mobile',
			array( $this, 'render_settings_page' )
		);
	}

	/**
	 * Register settings and fields.
	 *
	 * @since 0.1.2
	 *
	 * @return void
	 */
	public function register_settings() {
		register_setting(
			self::OPTION_GROUP,
			self::OPTION_NAME,
			array(
				'sanitize_callback' => array( $this, 'sanitize_settings' ),
				'default'           => $this->defaults,
			)
		);

		add_settings_section(
			'mosne_hero_image_sizes',
			__( 'Image Sizes', 'mosne-hero' ),
			array( $this, 'render_image_sizes_section' ),
			'mosne-hero-mobile'
		);

		add_settings_field(
			'image_sizes_table',
			'',
			array( $this, 'render_image_sizes_table' ),
			'mosne-hero-mobile',
			'mosne_hero_image_sizes'
		);

		add_settings_section(
			'mosne_hero_breakpoint',
			__( 'Breakpoint Settings', 'mosne-hero' ),
			array( $this, 'render_breakpoint_section' ),
			'mosne-hero-mobile'
		);

		add_settings_field(
			'breakpoint_table',
			'',
			array( $this, 'render_breakpoint_table' ),
			'mosne-hero-mobile',
			'mosne_hero_breakpoint'
		);
	}

	/**
	 * Sanitize settings input.
	 *
	 * @since 0.1.2
	 *
	 * @param array $input Raw input data.
	 * @return array Sanitized settings.
	 */
	public function sanitize_settings( $input ) {
		$sanitized = array();

		// Enable image size.
		$sanitized['enable_image_size'] = isset( $input['enable_image_size'] ) && $input['enable_image_size'];

		// Mobile width.
		$sanitized['mobile_width'] = isset( $input['mobile_width'] ) ? absint( $input['mobile_width'] ) : $this->defaults['mobile_width'];
		if ( $sanitized['mobile_width'] < 0 ) {
			$sanitized['mobile_width'] = $this->defaults['mobile_width'];
		}

		// Mobile height.
		$sanitized['mobile_height'] = isset( $input['mobile_height'] ) ? absint( $input['mobile_height'] ) : $this->defaults['mobile_height'];
		if ( $sanitized['mobile_height'] < 0 ) {
			$sanitized['mobile_height'] = $this->defaults['mobile_height'];
		}

		// Crop option.
		$sanitized['crop'] = isset( $input['crop'] ) && $input['crop'];

		// Breakpoint.
		$sanitized['breakpoint'] = isset( $input['breakpoint'] ) ? absint( $input['breakpoint'] ) : $this->defaults['breakpoint'];
		if ( $sanitized['breakpoint'] < 0 ) {
			$sanitized['breakpoint'] = $this->defaults['breakpoint'];
		}

		return $sanitized;
	}

	/**
	 * Render image sizes section description.
	 *
	 * @since 0.1.2
	 *
	 * @return void
	 */
	public function render_image_sizes_section() {
		echo '<p>' . esc_html__( 'Configure the mobile image sizes that will be registered in WordPress.', 'mosne-hero' ) . '</p>';
	}

	/**
	 * Render image sizes table.
	 *
	 * @since 0.1.2
	 *
	 * @return void
	 */
	public function render_image_sizes_table() {
		$settings = $this->get_settings();
		$option_name = self::OPTION_NAME;
		?>
		<tr>
			<th scope="row">
				<label for="<?php echo esc_attr( $option_name ); ?>_enable_image_size">
					<?php esc_html_e( 'Enable Image Sizes', 'mosne-hero' ); ?>
				</label>
			</th>
			<td>
				<label>
					<input type="checkbox" name="<?php echo esc_attr( $option_name ); ?>[enable_image_size]" id="<?php echo esc_attr( $option_name ); ?>_enable_image_size" value="1" <?php checked( $settings['enable_image_size'], true ); ?>>
					<?php esc_html_e( 'Register mobile image sizes in WordPress', 'mosne-hero' ); ?>
				</label>
				<p class="description">
					<?php esc_html_e( 'When enabled, the mobile image sizes will be registered and available for use throughout WordPress.', 'mosne-hero' ); ?>
				</p>
			</td>
		</tr>
		<tr>
			<th scope="row"><?php esc_html_e( 'Hero Mobile size', 'mosne-hero' ); ?></th>
			<td>
				<fieldset>
					<legend class="screen-reader-text"><span><?php esc_html_e( 'Hero Mobile size', 'mosne-hero' ); ?></span></legend>
					<label for="<?php echo esc_attr( $option_name ); ?>_mobile_width"><?php esc_html_e( 'Width', 'mosne-hero' ); ?></label>
					<input name="<?php echo esc_attr( $option_name ); ?>[mobile_width]" type="number" step="1" min="0" id="<?php echo esc_attr( $option_name ); ?>_mobile_width" value="<?php echo esc_attr( $settings['mobile_width'] ); ?>" class="small-text">
					<br>
					<label for="<?php echo esc_attr( $option_name ); ?>_mobile_height"><?php esc_html_e( 'Height', 'mosne-hero' ); ?></label>
					<input name="<?php echo esc_attr( $option_name ); ?>[mobile_height]" type="number" step="1" min="0" id="<?php echo esc_attr( $option_name ); ?>_mobile_height" value="<?php echo esc_attr( $settings['mobile_height'] ); ?>" class="small-text">
				</fieldset>
				<input name="<?php echo esc_attr( $option_name ); ?>[crop]" type="checkbox" id="<?php echo esc_attr( $option_name ); ?>_crop" value="1" <?php checked( $settings['crop'], true ); ?>>
				<label for="<?php echo esc_attr( $option_name ); ?>_crop"><?php esc_html_e( 'Crop mobile images to exact dimensions (normally images are proportional)', 'mosne-hero' ); ?></label>
				<p class="description">
					<?php esc_html_e( 'Retina size (2x) will be automatically calculated from these dimensions.', 'mosne-hero' ); ?>
				</p>
				<p class="description">
					<strong><?php esc_html_e( 'Note:', 'mosne-hero' ); ?></strong> <?php esc_html_e( 'After changing these dimensions, you will need to regenerate thumbnails using a plugin like Regenerate Thumbnails for existing images to use the new sizes.', 'mosne-hero' ); ?>
				</p>
			</td>
		</tr>
		<?php
	}

	/**
	 * Render breakpoint section description.
	 *
	 * @since 0.1.2
	 *
	 * @return void
	 */
	public function render_breakpoint_section() {
		echo '<p>' . esc_html__( 'Configure the breakpoint at which mobile images are displayed. Images will be shown on screens with a maximum width equal to this value.', 'mosne-hero' ) . '</p>';
	}

	/**
	 * Render breakpoint table.
	 *
	 * @since 0.1.2
	 *
	 * @return void
	 */
	public function render_breakpoint_table() {
		$settings = $this->get_settings();
		$option_name = self::OPTION_NAME;
		?>
		<tr>
			<th scope="row">
				<label for="<?php echo esc_attr( $option_name ); ?>_breakpoint">
					<?php esc_html_e( 'Mobile Breakpoint', 'mosne-hero' ); ?>
				</label>
			</th>
			<td>
				<input name="<?php echo esc_attr( $option_name ); ?>[breakpoint]" type="number" step="1" min="0" id="<?php echo esc_attr( $option_name ); ?>_breakpoint" value="<?php echo esc_attr( $settings['breakpoint'] ); ?>" class="small-text">
				<span class="description"><?php esc_html_e( 'px', 'mosne-hero' ); ?></span>
				<p class="description">
					<?php esc_html_e( 'The maximum viewport width at which mobile images will be displayed. Suggested values: 600px or 728px.', 'mosne-hero' ); ?>
				</p>
			</td>
		</tr>
		<?php
	}

	/**
	 * Render settings page.
	 *
	 * @since 0.1.2
	 *
	 * @return void
	 */
	public function render_settings_page() {
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'You do not have sufficient permissions to access this page.', 'mosne-hero' ) );
		}
		?>
		<div class="wrap">
			<h1><?php echo esc_html( get_admin_page_title() ); ?></h1>
			<form action="options.php" method="post">
				<?php
				settings_fields( self::OPTION_GROUP );
				do_settings_sections( 'mosne-hero-mobile' );
				submit_button();
				?>
			</form>
		</div>
		<?php
	}

	/**
	 * Get plugin settings with filters applied.
	 *
	 * @since 0.1.2
	 *
	 * @return array Settings array.
	 */
	public function get_settings() {
		$settings = get_option( self::OPTION_NAME, $this->defaults );
		$settings = wp_parse_args( $settings, $this->defaults );

		/**
		 * Filter plugin settings.
		 *
		 * @since 0.1.2
		 *
		 * @param array $settings Current settings.
		 * @return array Modified settings.
		 */
		$settings = apply_filters( 'mosne_hero_settings', $settings );

		return $settings;
	}

	/**
	 * Get a specific setting value.
	 *
	 * @since 0.1.2
	 *
	 * @param string $key     Setting key.
	 * @param mixed  $default Default value if key doesn't exist.
	 * @return mixed Setting value.
	 */
	public function get_setting( $key, $default = null ) {
		$settings = $this->get_settings();
		return isset( $settings[ $key ] ) ? $settings[ $key ] : $default;
	}

	/**
	 * Check if image size registration is enabled.
	 *
	 * @since 0.1.2
	 *
	 * @return bool True if enabled, false otherwise.
	 */
	public function is_image_size_enabled() {
		/**
		 * Filter whether image size registration is enabled.
		 *
		 * @since 0.1.2
		 *
		 * @param bool $enabled Whether image size is enabled.
		 * @return bool Modified value.
		 */
		return apply_filters( 'mosne_hero_enable_image_size', $this->get_setting( 'enable_image_size', true ) );
	}

	/**
	 * Get mobile image width.
	 *
	 * @since 0.1.2
	 *
	 * @return int Mobile image width in pixels.
	 */
	public function get_mobile_width() {
		/**
		 * Filter mobile image width.
		 *
		 * @since 0.1.2
		 *
		 * @param int $width Mobile image width in pixels.
		 * @return int Modified width.
		 */
		return apply_filters( 'mosne_hero_mobile_width', $this->get_setting( 'mobile_width', 414 ) );
	}

	/**
	 * Get mobile retina image width.
	 *
	 * Calculated as 2x the mobile width.
	 *
	 * @since 0.1.2
	 *
	 * @return int Mobile retina image width in pixels.
	 */
	public function get_mobile_retina_width() {
		$mobile_width = $this->get_mobile_width();
		$retina_width = $mobile_width * 2;
		/**
		 * Filter mobile retina image width.
		 *
		 * @since 0.1.2
		 *
		 * @param int $width Mobile retina image width in pixels.
		 * @return int Modified width.
		 */
		return apply_filters( 'mosne_hero_mobile_retina_width', $retina_width );
	}

	/**
	 * Get mobile image height.
	 *
	 * @since 0.1.2
	 *
	 * @return int Mobile image height in pixels.
	 */
	public function get_mobile_height() {
		/**
		 * Filter mobile image height.
		 *
		 * @since 0.1.2
		 *
		 * @param int $height Mobile image height in pixels.
		 * @return int Modified height.
		 */
		return apply_filters( 'mosne_hero_mobile_height', $this->get_setting( 'mobile_height', 736 ) );
	}

	/**
	 * Get mobile retina image height.
	 *
	 * Calculated as 2x the mobile height.
	 *
	 * @since 0.1.2
	 *
	 * @return int Mobile retina image height in pixels.
	 */
	public function get_mobile_retina_height() {
		$mobile_height = $this->get_mobile_height();
		$retina_height = $mobile_height * 2;
		/**
		 * Filter mobile retina image height.
		 *
		 * @since 0.1.2
		 *
		 * @param int $height Mobile retina image height in pixels.
		 * @return int Modified height.
		 */
		return apply_filters( 'mosne_hero_mobile_retina_height', $retina_height );
	}

	/**
	 * Get crop option.
	 *
	 * @since 0.1.2
	 *
	 * @return bool True if crop is enabled, false otherwise.
	 */
	public function get_crop() {
		/**
		 * Filter crop option.
		 *
		 * @since 0.1.2
		 *
		 * @param bool $crop Whether to crop images.
		 * @return bool Modified crop value.
		 */
		return apply_filters( 'mosne_hero_crop', $this->get_setting( 'crop', true ) );
	}

	/**
	 * Get breakpoint value.
	 *
	 * @since 0.1.2
	 *
	 * @return int Breakpoint in pixels.
	 */
	public function get_breakpoint() {
		/**
		 * Filter breakpoint value.
		 *
		 * @since 0.1.2
		 *
		 * @param int $breakpoint Breakpoint in pixels.
		 * @return int Modified breakpoint.
		 */
		return apply_filters( 'mosne_hero_breakpoint', $this->get_setting( 'breakpoint', 728 ) );
	}
}

