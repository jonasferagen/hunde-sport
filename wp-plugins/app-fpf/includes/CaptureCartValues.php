<?php
if ( ! defined('ABSPATH') ) { exit; }

/**
 * Set to true temporarily to see dumps during add-to-cart.
 * (You can also define('APP_FPF_DEBUG', true) in wp-config.php.)
 */
if ( ! defined('APP_FPF_DEBUG') ) {
  define('APP_FPF_DEBUG', false);
}

/** Last parsed values for this request, for the late fallback */
$GLOBALS['APP_FPF_LAST_VALUES'] = null;

/** Fallback raw body reader (some clients trip get_json_params()) */
function app_fpf_read_raw_json_body(): array {
  $raw = file_get_contents('php://input');
  if ( ! is_string($raw) || $raw === '' ) return [];
  $decoded = json_decode($raw, true);
  return is_array($decoded) ? $decoded : [];
}

/**
 * EARLY: Store API filter to attach custom data.
 * IMPORTANT: put custom values under 'cart_item_data' (not top-level),
 * otherwise they won’t make it into the cart line.
 */
add_filter('woocommerce_store_api_add_to_cart_data', function( $cart_item_data, $request ) {

  $json = is_callable([$request, 'get_json_params'])
    ? (array) $request->get_json_params()
    : (array) $request->get_params();

  if ( empty($json) ) {
    $json = app_fpf_read_raw_json_body();
  }

  $vals = null;
  if ( isset($json['extensions']) && is_array($json['extensions']) ) {
    $ns = $json['extensions'][ APP_FPF_NS ] ?? null;
    if ( is_array($ns) && isset($ns['values']) && is_array($ns['values']) ) {
      $vals = $ns['values'];
    }
  }

  $GLOBALS['APP_FPF_LAST_VALUES'] = $vals;

  if ( is_array($vals) && ! empty($vals) ) {
    if ( ! isset($cart_item_data['cart_item_data']) || ! is_array($cart_item_data['cart_item_data']) ) {
      $cart_item_data['cart_item_data'] = [];
    }
    // ✅ THE critical line:
    $cart_item_data['cart_item_data'][ APP_FPF_NS ] = $vals;
  }

  if ( APP_FPF_DEBUG ) {
    header('Content-Type: text/plain; charset=utf-8');
    echo "==== app_fpf DEBUG (woocommerce_store_api_add_to_cart_data) ====\n";
    echo "Parsed body:\n"; print_r($json);
    echo "\nExtracted extensions.app_fpf.values:\n"; print_r($vals);
    echo "\ncart_item_data AFTER attach:\n"; print_r($cart_item_data);
    // die(); // uncomment for a one-shot sanity check
  }

  return $cart_item_data;
}, 10, 2 );

/**
 * LATE FALLBACK: ensure the values end up on the actual cart line even if
 * something upstream dropped 'cart_item_data' on the floor.
 */
add_action('woocommerce_add_to_cart', function( $cart_item_key, $product_id, $quantity, $variation_id, $variation, $incoming ) {

  $vals = null;

  if ( isset($incoming['cart_item_data'][ APP_FPF_NS ]) && is_array($incoming['cart_item_data'][ APP_FPF_NS ]) ) {
    $vals = $incoming['cart_item_data'][ APP_FPF_NS ];
  } elseif ( isset($incoming[ APP_FPF_NS ]) && is_array($incoming[ APP_FPF_NS ]) ) {
    $vals = $incoming[ APP_FPF_NS ];
  } elseif ( isset($GLOBALS['APP_FPF_LAST_VALUES']) && is_array($GLOBALS['APP_FPF_LAST_VALUES']) ) {
    $vals = $GLOBALS['APP_FPF_LAST_VALUES'];
  }

  if ( is_array($vals) && ! empty($vals) ) {
    WC()->cart->cart_contents[ $cart_item_key ][ APP_FPF_NS ] = $vals;
  }

  if ( APP_FPF_DEBUG ) {
    header('Content-Type: text/plain; charset=utf-8');
    echo "==== app_fpf DEBUG (woocommerce_add_to_cart) ====\n";
    echo "Resolved values:\n"; print_r($vals);
    echo "\nCart line after set:\n"; print_r( WC()->cart->get_cart_item( $cart_item_key ) );
    // die();
  }
}, 10, 6 );
