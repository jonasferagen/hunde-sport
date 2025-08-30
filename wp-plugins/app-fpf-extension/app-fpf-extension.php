<?php
/**
 * Plugin Name: App – Store API: Flexible Product Fields
 * Description: Expose FPF fields to Store API products and accept values on add-to-cart.
 * Version: 0.1.1
 * Author: Hunde-sport.no
 */

use Automattic\WooCommerce\StoreApi\Schemas\V1\ProductSchema;

/** Post type and meta keys used by FPF */
const APP_FPF_POST_TYPE      = 'fpf_fields';   // confirmed by your note
const APP_FPF_FIELDS_META    = '_fields';      // confirmed by your note
// Assignment keys differ across versions; we'll search all meta values.

add_action('plugins_loaded', function () {

  /**
   * Does this FPF group target the given product?
   * Scans all meta values for the product ID, handling arrays and serialized strings.
   */
  function app_fpf_group_targets_product( int $group_id, int $product_id ): bool {
    $all = get_post_meta( $group_id ); // array: meta_key => [values...]
    if ( empty($all) ) return false;

    foreach ( $all as $key => $values ) {
      foreach ( (array) $values as $val ) {
        // exact array match?
        if ( is_array($val) && in_array( $product_id, array_map('intval', $val), true ) ) {
          return true;
        }
        // serialized / string match?
        if ( is_string($val) ) {
          // look for “123” with quotes to avoid 12 matching 123
          if ( strpos( $val, '"' . $product_id . '"' ) !== false ) return true;
          // sometimes stored as i:123; or plain "123"
          if ( strpos( $val, 'i:' . $product_id ) !== false ) return true;
          if ( $val === (string) $product_id ) return true;
        }
      }
    }
    return false;
  }

  /**
   * Collect all FPF groups that target the product.
   * We fetch all groups once and filter in PHP — simpler and reliable across key variants.
   */
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

  /**
   * Map one group's _fields meta → extension shape.
   * FPF stores an array; we’re defensive with defaults.
   */
  function app_fpf_map_fields_from_group( int $group_id ): array {
    $raw = get_post_meta( $group_id, APP_FPF_FIELDS_META, true );
    if ( !is_array($raw) ) return [];

    $out = [];
    $i = 0;
    foreach ( $raw as $f ) {
      $i++;
      $key      = isset($f['name'])        ? sanitize_key($f['name'])
                : (isset($f['key'])        ? sanitize_key($f['key'])
                :                            'line_'.$i);
      $label    = isset($f['label'])       ? wp_strip_all_tags($f['label']) : ('Linje '.$i);
      $required = !empty($f['required']);
      $maxlen   = isset($f['max_length'])  ? (int)$f['max_length'] : 40;
      $lines    = isset($f['lines'])       ? (int)$f['lines'] : 1;

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

  /**
   * Gather fields from all matching groups and merge.
   * If multiple groups target the same product, concatenate (you can dedupe by key if needed).
   */
  function app_fpf_get_fields_for_product( int $product_id ): array {
    $groups = app_fpf_groups_for_product( $product_id );
    if ( empty($groups) ) return [];

    $fields = [];
    foreach ( $groups as $gid ) {
      $fields = array_merge( $fields, app_fpf_map_fields_from_group( (int)$gid ) );
    }
    return $fields;
  }

  // --- Store API extension: product GET ---

  woocommerce_store_api_register_endpoint_data([
    'endpoint'        => ProductSchema::IDENTIFIER,
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
      $product_id = is_object($product) ? $product->get_id() : (int)$product;
      return [ 'fields' => app_fpf_get_fields_for_product( $product_id ) ];
    },
  ]);

  // --- Store API extension: cart add-item (values passthrough) ---

  woocommerce_store_api_register_update_callback([
    'namespace' => 'app_fpf',
    'callback'  => function( $data ) {
      add_filter('woocommerce_add_cart_item_data', function( $cart_item_data ) use ( $data ) {
        if ( isset($data['values']) ) {
          $vals = wc_clean( $data['values'] ); // recursive clean; accepts arrays
          if ( is_array($vals) ) {
            $cart_item_data['app_fpf'] = $vals;
          }
        }
        return $cart_item_data;
      }, 10, 1);
    },
  ]);
});
