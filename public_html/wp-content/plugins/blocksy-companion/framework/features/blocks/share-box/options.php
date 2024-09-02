<?php
/**
 * Options for shares widget.
 *
 * @copyright 2019-present Creative Themes
 * @license   http://www.gnu.org/copyleft/gpl.html GNU General Public License
 * @package Blocksy
 */

// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound
$options = [
	'title' => [
		'type' => 'hidden',
		'label' => __('Title', 'blocksy-companion'),
		'value' => __('Share Icons', 'blocksy-companion'),
	],
	
	'share_facebook' => [
		'label' => __( 'Facebook', 'blocksy-companion' ),
		'type' => 'ct-switch',
		'value' => 'yes',
	],

	'share_twitter' => [
		'label' => __( 'X (Twitter)', 'blocksy-companion' ),
		'type' => 'ct-switch',
		'value' => 'yes',
	],

	'share_pinterest' => [
		'label' => __( 'Pinterest', 'blocksy-companion' ),
		'type' => 'ct-switch',
		'value' => 'yes',
	],

	'share_linkedin' => [
		'label' => __( 'LinkedIn', 'blocksy-companion' ),
		'type' => 'ct-switch',
		'value' => 'yes',
	],

	'share_reddit' => [
		'label' => __( 'Reddit', 'blocksy-companion' ),
		'type' => 'ct-switch',
		'value' => 'no',
	],

	'share_hacker_news' => [
		'label' => __( 'Hacker News', 'blocksy-companion' ),
		'type' => 'ct-switch',
		'value' => 'no',
	],

	'share_vk' => [
		'label' => __( 'VKontakte', 'blocksy-companion' ),
		'type' => 'ct-switch',
		'value' => 'no',
	],

	'share_ok' => [
		'label' => __( 'Odnoklassniki', 'blocksy-companion' ),
		'type' => 'ct-switch',
		'value' => 'no',
	],

	'share_telegram' => [
		'label' => __( 'Telegram', 'blocksy-companion' ),
		'type' => 'ct-switch',
		'value' => 'no',
	],

	'share_viber' => [
		'label' => __( 'Viber', 'blocksy-companion' ),
		'type' => 'ct-switch',
		'value' => 'no',
	],

	'share_whatsapp' => [
		'label' => __( 'WhatsApp', 'blocksy-companion' ),
		'type' => 'ct-switch',
		'value' => 'no',
	],

	'share_flipboard' => [
		'label' => __( 'Flipboard', 'blocksy-companion' ),
		'type' => 'ct-switch',
		'value' => 'no',
	],

	'share_line' => [
		'label' => __( 'Line', 'blocksy-companion' ),
		'type' => 'ct-switch',
		'value' => 'no',
	],

	'share_email' => [
		'label' => __( 'Email', 'blocksy-companion' ),
		'type' => 'ct-switch',
		'value' => 'no',
	],

	'share_clipboard' => [
		'label' => __( 'Clipboard', 'blocksy-companion' ),
		'type' => 'ct-switch',
		'value' => 'no',
	],

	'share_item_tooltip' => [
		'type' => 'ct-switch',
		'label' => __('Tooltip', 'blocksy-companion'),
		'value' => 'no',
		'divider' => 'top:full',
	],

	'link_nofollow' => [
		'type' => 'ct-switch',
		'label' => __('Set links to nofollow', 'blocksy-companion'),
		'value' => 'no',
	],

	'share_icons_size' => [
		'label' => __( 'Icons Size', 'blocksy-companion' ),
		'type' => 'ct-slider',
		'min' => 5,
		'max' => 50,
		'value' => '',
		'responsive' => false,
		'divider' => 'top:full',
	],

	'items_spacing' => [
		'label' => __( 'Icons Spacing', 'blocksy-companion' ),
		'type' => 'ct-slider',
		'min' => 5,
		'max' => 50,
		'value' => '',
		'responsive' => false,
	],

	'share_icons_color' => [
		'label' => __('Icons Color', 'blocksy-companion'),
		'type' => 'ct-radio',
		'value' => 'default',
		'view' => 'text',
		'divider' => 'top:full',
		'setting' => ['transport' => 'postMessage'],
		'choices' => [
			'default' => __('Custom', 'blocksy-companion'),
			'official' => __('Official', 'blocksy-companion'),
		],
	],

	'share_type' => [
		'label' => __('Icons Shape Type', 'blocksy-companion'),
		'type' => 'ct-radio',
		'value' => 'simple',
		'view' => 'text',
		'setting' => ['transport' => 'postMessage'],
		'choices' => [
			'simple' => __('None', 'blocksy-companion'),
			'rounded' => __('Rounded', 'blocksy-companion'),
			'square' => __('Square', 'blocksy-companion'),
		],
	],

	blocksy_rand_md5() => [
		'type' => 'ct-condition',
		'condition' => ['share_type' => '!simple'],
		'options' => [
			'share_icons_fill' => [
				'label' => __('Shape Fill Type', 'blocksy-companion'),
				'type' => 'ct-radio',
				'value' => 'outline',
				'view' => 'text',
				'setting' => ['transport' => 'postMessage'],
				'choices' => [
					'outline' => __('Outline', 'blocksy-companion'),
					'solid' => __('Solid', 'blocksy-companion'),
				],
			],
		],
	],
];
