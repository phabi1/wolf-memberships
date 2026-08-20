<?php

/*
Plugin Name: Wolf Membership
Plugin URI: http://wordpress.org/plugins/wolf-membership/
Description: This is not just a plugin, it symbolizes the hope and enthusiasm of an entire generation summed up in two words sung most famously by Louis Armstrong: Hello, Dolly. When activated you will randomly see a lyric from <cite>Hello, Dolly</cite> in the upper right of your admin screen on every page.
Author: Phabi1
Version: 0.0.1
Author URI: http://www.rollerlesloups.fr/
Requires plugins: wolf-billing,wolf
*/

require __DIR__ . '/vendor/autoload.php';

define('WOLF_MEMBERSHIP_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('WOLF_MEMBERSHIP_DB_VERSION', '0.0.1');

$plugin = new \Wolf\Memberships\Plugin();
$plugin->run();