<?php
if ( ! defined('ABSPATH') ) { exit; }

use Automattic\WooCommerce\StoreApi\Schemas\V1\CartItemSchema;

add_action('plugins_loaded', function () {
  if ( ! class_exists( CartItemSchema::class ) ) return;

  woocommerce_store_api_register_endpoint_data([
    'endpoint'        => CartItemSchema::IDENTIFIER,
    'namespace'       => APP_FPF_NS,
    'schema_callback' => function () {
      return [
        'values' => [
          'description' => 'Submitted app_fpf values for this cart item',
          'type'        => 'object',
          'properties'  => [], // free-form object
        ],
      ];
    },
    'data_callback'   => function( $cart_item ) {
      return [
        'values' => isset($cart_item[ APP_FPF_NS ]) && is_array($cart_item[ APP_FPF_NS ])
          ? $cart_item[ APP_FPF_NS ]
          : new stdClass(),
      ];
    },
  ]);
});
