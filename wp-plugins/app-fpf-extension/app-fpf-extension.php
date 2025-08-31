<?php
/**
 * Plugin Name: App – Store API: Flexible Product Fields
 * Description: Expose FPF fields to Store API products and accept values on add-to-cart.
 * Version: 0.1.3
 * Author: Hunde-sport.no
 */

use Automattic\WooCommerce\StoreApi\Schemas\V1\ProductSchema;
use Automattic\WooCommerce\StoreApi\Schemas\V1\CartItemSchema;

const APP_FPF_POST_TYPE   = 'fpf_fields';
const APP_FPF_FIELDS_META = '_fields';

add_action('plugins_loaded', function () {

  /* -------------------- Helpers -------------------- */

  /** Does FPF group target the product? */
  function app_fpf_group_targets_product( int $group_id, int $product_id ): bool {
    $all = get_post_meta( $group_id ); // meta_key => [values...]
    if ( empty($all) ) return false;

    foreach ( $all as $values ) {
      foreach ( (array) $values as $val ) {
        if ( is_array($val) && in_array( $product_id, array_map('intval', $val), true ) ) return true;
        if ( is_string($val) ) {
          if ( strpos( $val, '"' . $product_id . '"' ) !== false ) return true; // "...123..."
          if ( strpos( $val, 'i:' . $product_id ) !== false ) return true;      // i:123;
          if ( $val === (string) $product_id ) return true;                      // "123"
        }
      }
    }
    return false;
  }

  /** All FPF groups that target a product */
  function app_fpf_groups_for_product( int $product_id ): array {
    $groups = get_posts([
      'post_type'      => APP_FPF_POST_TYPE,
      'post_status'    => 'publish',
      'posts_per_page' => -1,
      'fields'         => 'ids',
    ]);
    if ( empty($groups) ) return [];
    return array_values( array_filter( $groups, fn($gid) => app_fpf_group_targets_product( (int)$gid, $product_id ) ) );
  }

  /** Map one group's _fields meta to normalized items */
  function app_fpf_map_fields_from_group( int $group_id ): array {
    $raw = get_post_meta( $group_id, APP_FPF_FIELDS_META, true );
    if ( !is_array($raw) ) return [];

    $out = [];
    $i = 0;
    foreach ( $raw as $f ) {
      $i++;
      $key      = isset($f['name']) ? sanitize_key($f['name'])
                : (isset($f['key']) ? sanitize_key($f['key']) : 'line_'.$i);
      $label    = isset($f['label']) ? wp_strip_all_tags($f['label']) : ('Linje '.$i);
      $required = !empty($f['required']);
      $maxlen   = isset($f['max_length']) ? (int)$f['max_length'] : 40;
      $lines    = isset($f['lines']) ? (int)$f['lines'] : 1;

      $out[] = [
        'key'      => $key,
        'label'    => $label,
        'required' => $required,
        'maxlen'   => $maxlen,
        'lines'    => $lines,
      ];
    }
    return $out;
  }

  /** Merge fields from all matching groups */
  function app_fpf_get_fields_for_product( int $product_id ): array {
    $groups = app_fpf_groups_for_product( $product_id );
    if ( empty($groups) ) return [];
    $fields = [];
    foreach ( $groups as $gid ) {
      $fields = array_merge( $fields, app_fpf_map_fields_from_group( (int)$gid ) );
    }
    return $fields;
  }

  /* -------------------- 1) PRODUCT extension (available fields) -------------------- */

  woocommerce_store_api_register_endpoint_data([
    'endpoint'        => ProductSchema::IDENTIFIER,  // product-level
    'namespace'       => 'app_fpf',
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
      $product_id = is_object($product) ? $product->get_id() : (int) $product;
      return [ 'fields' => app_fpf_get_fields_for_product( $product_id ) ];
    },
  ]);

  /* -------------------- 2) ADD-ITEM hook (attach values to cart item) -------------------- */

  add_filter( 'woocommerce_store_api_add_to_cart_data', function( $cart_item_data, $request ) {
    $json = is_callable([ $request, 'get_json_params' ])
      ? (array) $request->get_json_params()
      : (array) $request->get_params();

    if ( function_exists('wc_get_logger') ) {
      wc_get_logger()->info('[ADD-ITEM raw] ' . wp_json_encode($json), [ 'source' => 'app_fpf' ]);
    }

    $ext = $json['extensions']['app_fpf']['values'] ?? null;

    if ( is_array($ext) ) {
      $clean = [];
      foreach ( $ext as $k => $v ) {
        $k = sanitize_text_field((string) $k);
        $v = trim((string) $v);
        if ( $v !== '' ) $clean[$k] = $v;
      }
      if ( ! empty($clean) ) {
        $cart_item_data['app_fpf'] = $clean;

        if ( function_exists('wc_get_logger') ) {
          wc_get_logger()->info('[ADD-ITEM attached app_fpf] ' . wp_json_encode($clean), [ 'source' => 'app_fpf' ]);
        }
      }
    }

    return $cart_item_data;
  }, 10, 2 );

  // Persist through session restore
  add_filter( 'woocommerce_get_cart_item_from_session', function( $cart_item, $values ) {
    if ( isset($values['app_fpf']) && is_array($values['app_fpf']) ) {
      $cart_item['app_fpf'] = $values['app_fpf'];
    }
    return $cart_item;
  }, 10, 2 );

  /* -------------------- 3) CART-ITEM extension (expose entered values) -------------------- */

  woocommerce_store_api_register_endpoint_data([
    'endpoint'        => CartItemSchema::IDENTIFIER, // per line item
    'namespace'       => 'app_fpf',
    'schema_callback' => function () {
      return [
        'values' => [
          'description' => 'Flexible Product Fields values attached to this cart item',
          'type'        => 'object',
          'context'     => [ 'view', 'edit' ],
          'readonly'    => true,
        ],
      ];
    },
    'data_callback'   => function( $cart_item ) {
      $values = ( isset($cart_item['app_fpf']) && is_array($cart_item['app_fpf']) )
        ? $cart_item['app_fpf']
        : [];

      return [
        'values' => ! empty($values) ? $values : new \stdClass(),
      ];
    },
  ]);

});
