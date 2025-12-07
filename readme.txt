=== Mosne Hero  ===
Contributors:      mosne
Tags:              block, cover, image, performance
Requires PHP:      7.4
Requires at least: 6.7
Tested up to:      6.9
Stable tag:        0.1.0
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

This plugin extends the core/cover block with separate mobile and desktop background images and sizes.
== Description ==
This plugin extends the core/cover block with separate mobile and desktop background images and sizes.
This increases the performance of the website by loading the smaller image on mobile devices and score better in the Core Web Vitals.

== Configuration ==
* In the Setting > Mosne Hero page you can configure the mobile image size and the breakpoint at which the mobile image is displayed
* Notice that is a new size so you will need to regenerate the thumbnails using a plugin like Regenerate Thumbnails for existing images to use the new sizes.

== In the Editor ==
* Add a cover block and select the "Hero Cover (Mobile & Desktop)" variation.
* Now you can see a new panel with the following options:
* Mobile image : You can also select a custom image for the desktop and the mobile view.
* Mobile image size : chose the size that perfectly fits your design.
* Focal point : You can also select a focal point for the mobile image.
* Alt text : Add an alternative  text for the mobile image. (Leave empty if is a decorative image)
* High fetch priority : force the high fetch priority attribute if the image is in the is above the fold.
* If you use a featured image, leave the mobile image empty and the plugin will use the mobile size for the featured image for the mobile view.

== Limitations ==
* The mobile image is not displayed in the block editor
* Video background is not supported
* Repeated background is not supported
* Parallax background is not supported

== Key Features ==

* Separate mobile and desktop background images and sizes
* Configure the mobile image size and the breakpoint at which the mobile image is displayed
* It works also wiht the featured image
* Focal point switching for the mobile image
* Alt text switching for the mobile image
* High fetch priority for the mobile image
* Performance-optimized and lightweight
* No block library required
* Primarily built with native WordPress components

== Limitations ==
* The mobile image is not displayed in the block editor
* Video background is not supported
* Repeated background is not supported
* Parallax background is not supported

== Stay Connected ==

* [View on GitHub](https://github.com/mosne/mosne-hero)
* [Visit my website](https://mosne.it/)
* [Follow on Twitter](https://x.com/mosne)

== Installation ==

This section describes how to install the plugin and get it working.

e.g.

1. Upload the plugin files to the `/wp-content/plugins/mosne-hero` directory, or install the plugin through the WordPress plugins screen directly.
1. Activate the plugin through the 'Plugins' screen in WordPress


== Frequently Asked Questions ==

= Can i use hooks to configure the plugin? =

Yes, you can use hooks to configure the plugin.

`
add_filter( 'mosne_hero_enable_image_size', '__return_false' );
add_filter( 'mosne_hero_mobile_width', 'your_function' );
add_filter( 'mosne_hero_mobile_retina_width', 'your_function' );
add_filter( 'mosne_hero_mobile_height', 'your_function' );
add_filter( 'mosne_hero_mobile_retina_height', 'your_function' );
add_filter( 'mosne_hero_crop', 'your_function' );
add_filter( 'mosne_hero_breakpoint', 'your_function' );
add_filter( 'mosne_hero_settings', 'your_function' );
`
this will disable the image size registration.
this will return the mobile width and the mobile retina width.
this will return the mobile height and the mobile retina height.
this will return the crop option.
this will return the breakpoint.
this will return the settings.


== Screenshots ==

1. Add a mobile image and a desktop image
2. Setup options and labels
3. render the block
4. exaple of source code for the block

== Changelog ==

= 0.1.0 =
* Release