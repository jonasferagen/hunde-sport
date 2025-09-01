<?php
if ( ! defined('ABSPATH') ) { exit; }

/**
 * Persist app_fpf values from the cart line to the order line item,
 * writing one meta row per field using the FPF field *labels* (e.g. "Linje 1").
 * FPF groups live on the *parent* product, so we resolve labels from the parent
 * when the line item is a variation.
 *
 * Optional: define('APP_FPF_SAVE_JSON', true) in wp-config.php to also save a JSON blob.
 * Optional: define('APP_FPF_JSON_META_KEY', '_app_fpf_debug') to change the JSON meta key
 * (leading underscore hides it in some UIs).
 */

if ( ! defined('APP_FPF_JSON_META_KEY') ) {
  define('APP_FPF_JSON_META_KEY', 'app_fpf'); // set to '_app_fpf_debug' to hide
}

add_action('woocommerce_checkout_create_order_line_item', function( $item, $cart_item_key, $values, $order ) {

  // 1) Ensure we have our values from the cart line
  if ( empty( $values[ APP_FPF_NS ] ) || ! is_array( $values[ APP_FPF_NS ] ) ) {
    return;
  }
  $app_values = $values[ APP_FPF_NS ];

  // 2) Resolve the correct product to read FPF fields from
  $product = $item->get_product();
  $product_id_for_fields = 0;
  if ( $product && $product->is_type('variation') ) {
    $product_id_for_fields = (int) $product->get_parent_id();  // 🔑 FPF groups live on parent
  } elseif ( $product ) {
    $product_id_for_fields = (int) $product->get_id();
  }
  if ( ! $product_id_for_fields ) {
    if ( defined('APP_FPF_SAVE_JSON') && APP_FPF_SAVE_JSON ) {
      $item->add_meta_data( APP_FPF_JSON_META_KEY, wp_json_encode( $app_values ), true );
    }
    return;
  }

  // 3) Load field config (key→label mapping)
  if ( ! function_exists( 'app_fpf_get_fields_for_product' ) ) {
    if ( defined('APP_FPF_SAVE_JSON') && APP_FPF_SAVE_JSON ) {
      $item->add_meta_data( APP_FPF_JSON_META_KEY, wp_json_encode( $app_values ), true );
    }
    return;
  }
  $fields = app_fpf_get_fields_for_product( $product_id_for_fields ); // ['key','label','required','maxlen','lines']

  if ( empty($fields) ) {
    if ( defined('APP_FPF_SAVE_JSON') && APP_FPF_SAVE_JSON ) {
      $item->add_meta_data( APP_FPF_JSON_META_KEY, wp_json_encode( $app_values ), true );
    }
    return;
  }

  $key_to_label = [];
  $key_to_maxlen = [];
  foreach ( $fields as $f ) {
    $k = isset($f['key']) ? (string) $f['key'] : '';
    if ( $k === '' ) continue;
    $label = isset($f['label']) ? wp_strip_all_tags( (string) $f['label'] ) : ucfirst( str_replace('_',' ', $k) );
    $key_to_label[ $k ] = $label;
    if ( isset($f['maxlen']) && is_numeric($f['maxlen']) ) {
      $key_to_maxlen[ $k ] = (int) $f['maxlen'];
    }
  }

  // 4) Write label-based meta rows exactly like the webshop flow
  foreach ( $app_values as $k => $val ) {
    if ( ! isset( $key_to_label[ $k ] ) ) continue; // ignore unknown keys
    $label = $key_to_label[ $k ];

    $clean = wc_clean( is_scalar($val) ? (string) $val : wp_json_encode( $val ) );
    if ( isset($key_to_maxlen[$k]) ) {
      $clean = mb_substr( $clean, 0, $key_to_maxlen[$k] );
    }

    $item->add_meta_data( $label, $clean, true );
  }

  // 5) Optional machine-readable blob for debugging/audits
  if ( defined('APP_FPF_SAVE_JSON') && APP_FPF_SAVE_JSON ) {
    $item->add_meta_data( APP_FPF_JSON_META_KEY, wp_json_encode( $app_values ), true );
  }

}, 20, 4);
