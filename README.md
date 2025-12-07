# Mosne Hero

![Hero](https://github.com/mosne/mosne-hero/blob/main/.wordpress-org/banner-1544x500.png)

## Description

Extends core/cover block with separate mobile and desktop background images and sizes.

### Key Features

* Separate mobile and desktop background images and sizes
* Configure the mobile image size and the breakpoint at which the mobile image is displayed
* Performance-optimized and lightweight
* No block library required
### Stay Connected

* [View on GitHub](https://github.com/mosne/mosne-hero)
* [Visit my website](https://mosne.it/)
* [Follow on Twitter](https://twitter.com/mosne)

## Installation

1. You have a couple of options:

* Go to Plugins &rarr; Add New and search for "Hero". Once found, click "Install".
* Download the Hero from wordpress.org and make sure the folder is zipped. Then upload via Plugins &rarr; Add New &rarr; Upload.

2. Activate the plugin through the 'Plugins' screen in WordPress.
3. Search for the "Hero" block within the Block Editor (Gutenberg) and add it to a block navigation.

## Frequently Asked Questions

### How can I configure the plugin?

You can configure the plugin in the settings page.
### What are the available hooks?

You can use the following hooks to configure the plugin:

```php
add_filter( 'mosne_hero_enable_image_size', '__return_false' );
add_filter( 'mosne_hero_mobile_width', 'your_function' );
add_filter( 'mosne_hero_mobile_retina_width', 'your_function' );
add_filter( 'mosne_hero_mobile_height', 'your_function' );
add_filter( 'mosne_hero_mobile_retina_height', 'your_function' );
add_filter( 'mosne_hero_crop', 'your_function' );
add_filter( 'mosne_hero_breakpoint', 'your_function' );
add_filter( 'mosne_hero_settings', 'your_function' );
```

this will disable the image size registration.
this will return the mobile width and the mobile retina width.
this will return the mobile height and the mobile retina height.
this will return the crop option.

## Screenshots

1. Add a mobile image and a desktop image
   ![screenshot-1](https://github.com/mosne/mosne-hero/blob/main/.wordpress-org/screenshot-1.gif)
2. Setup options and labels
   ![screenshot-2](https://github.com/mosne/mosne-hero/blob/main/.wordpress-org/screenshot-2.gif)
3. render the block
   ![screenshot-3](https://github.com/mosne/mosne-hero/blob/main/.wordpress-org/screenshot-3.gif)
4. exaple of source code for the block
   ![screenshot-4](https://github.com/mosne/mosne-hero/blob/main/.wordpress-org/screenshot-4.gif)
