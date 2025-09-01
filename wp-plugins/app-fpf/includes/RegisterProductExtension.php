<?php
if ( ! defined('ABSPATH') ) { exit; }

use Automattic\WooCommerce\StoreApi\Schemas\V1\ProductSchema;

add_action('plugins_loaded', function () {
  if ( ! class_exists( ProductSchema::class ) ) return;

  woocommerce_store_api_register_endpoint_data([
    'endpoint'        => ProductSchema::IDENTIFIER,
    'namespace'       => APP_FPF_NS,
    'schema_callback' => function () {
      return [
        'fields' => [
          'description' => 'Flexible Product Fields for this product',
          'type'        => 'array',
          'items'       => [
            'type'       => 'object',
            'properties' => [
              'key'      => [ 'type' => 'string' ],
              'label'    => [ 'type' => 'string' ],
              'required' => [ 'type' => 'boolean' ],
              'maxlen'   => [ 'type' => 'integer' ],
              'lines'    => [ 'type' => 'integer' ],
            ],
          ],
        ],
      ];
    },
    'data_callback'   => function( $product ) {
      $product_id = is_object($product) && method_exists($product,'get_id') ? (int) $product->get_id() : (int) $product;
      return [ 'fields' => app_fpf_get_fields_for_product( $product_id ) ];
    },
  ]);
});
