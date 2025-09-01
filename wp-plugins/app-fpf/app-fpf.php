<?php
/**
 * Plugin Name: App – Store API: Flexible Product Fields
 * Description: Expose FPF fields to Store API products and accept values on add-to-cart.
 * Version: 0.1.7
 * Author: Hunde-sport.no
 */

if ( ! defined('ABSPATH') ) { exit; }

use Automattic\WooCommerce\StoreApi\Schemas\V1\ProductSchema;
use Automattic\WooCommerce\StoreApi\Schemas\V1\CartItemSchema;

define('APP_FPF_NS', 'app_fpf');
define('APP_FPF_POST_TYPE', 'fpf_fields');
define('APP_FPF_FIELDS_META', '_fields');

require __DIR__ . '/includes/FieldSource.php';
require __DIR__ . '/includes/RegisterProductExtension.php';
require __DIR__ . '/includes/CaptureCartValues.php';
require __DIR__ . '/includes/RegisterCartItemExtension.php';
require __DIR__ . '/includes/OrderMeta.php';
require __DIR__ . '/includes/CartRestore.php';
