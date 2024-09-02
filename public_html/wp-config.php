<?php
/** Enable W3 Total Cache */
define('WP_CACHE', true); // Added by W3 Total Cache

/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the website, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://developer.wordpress.org/advanced-administration/wordpress/wp-config/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'arex_arex' );

/** Database username */
define( 'DB_USER', 'arex_arecofix' );

/** Database password */
define( 'DB_PASSWORD', '#Arecofix3015' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         '5/{w1#W_U;_kDW?/,^A}+{SgNQ6VC$+d+&9-s.7-M*mizNS_HEVA=E0=wX;r3` h' );
define( 'SECURE_AUTH_KEY',  '#E=$&fGK]c}2a_%:JH14pPyiU}2c)Efs67PAT(POrA6|dx_YVm|LM;gf]|N&h;GI' );
define( 'LOGGED_IN_KEY',    'e9UROeEn9?6ogH.6I:!>HHGrIps468uOZLZ8D&B}{dj]E@*ZDz~2U};(:h+U+U$N' );
define( 'NONCE_KEY',        '!N1SeC+mupF9@5c`FnQx^.<`ob}5N8o=i+-zhXgh`mCxn!YC=E/oAfo>W*[9c)<V' );
define( 'AUTH_SALT',        '#`uE7>q6$Bma?CzKZIHD,^,?/8I)hnk833Xvc@=8wXQll/es(MDz[DX?WLs2/2*E' );
define( 'SECURE_AUTH_SALT', '>[.OoCV!bDZvQw5fpjM}{2NE@8@)4cU*DV=L3@tjMa/{A)S:y*|t&IkLy`Kw3RlR' );
define( 'LOGGED_IN_SALT',   'Dg;};c-@&t?x^9Rzyo!>s$x?j5El5-B3h?o{7YCQ(,T?`Eobp:XN;n8k?hjFUYzG' );
define( 'NONCE_SALT',       'S|jd{2y,e,B?<Skb7TOca|*j{=iE}/ipc&8?~M/e9G5GF3e5pGZY2b#{U/lK5+<k' );

/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'Y4s8u_';


/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://developer.wordpress.org/advanced-administration/debug/debug-wordpress/
 */
define( 'WP_DEBUG', false );

/* Add any custom values between this line and the "stop editing" line. */



/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';