<?php
defined('ABSPATH') or die('No script kiddies please!');
if (!function_exists('ti_exclude_js')) {
function ti_exclude_js($list) {
$list []= 'trustindex.io';
$list []= 'https://cdn.trustindex.io/';
$list []= 'https://cdn.trustindex.io/loader.js';
$list []= 'https://cdn.trustindex.io/loader-cert.js';
$list []= 'https://cdn.trustindex.io/loader-feed.js';
return $list;
}
}
add_filter('rocket_exclude_js', 'ti_exclude_js');
add_filter('litespeed_optimize_js_excludes', 'ti_exclude_js');
add_filter('sgo_javascript_combine_excluded_external_paths', 'ti_exclude_js');
add_filter('rocket_excluded_inline_js_content', function($list) {
$list []= 'Trustindex.init_pager';
return $list;
});
add_filter('sgo_css_combine_exclude', function($list) {
foreach (array (
 0 => 'facebook',
 1 => 'google',
 2 => 'tripadvisor',
 3 => 'yelp',
 4 => 'booking',
 5 => 'trustpilot',
 6 => 'amazon',
 7 => 'arukereso',
 8 => 'airbnb',
 9 => 'hotels',
 10 => 'opentable',
 11 => 'foursquare',
 12 => 'capterra',
 13 => 'szallashu',
 14 => 'thumbtack',
 15 => 'expedia',
 16 => 'zillow',
 17 => 'wordpressPlugin',
 18 => 'aliexpress',
 19 => 'alibaba',
 20 => 'sourceForge',
 21 => 'ebay',
) as $platform) {
$list []= 'ti-widget-css-'. $platform;
}
foreach (array (
 0 => 'instagram',
 1 => 'facebook',
 2 => 'youtube',
 3 => 'tiktok',
) as $platform) {
$list []= 'trustindex-feed-widget-css-'. $platform;
}
return $list;
});
add_filter('rocket_rucss_safelist', function($list) {
$list []= 'trustindex-(.*).css';
$list []= '.ti-widget';
return $list;
});
?>