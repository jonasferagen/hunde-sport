<?php
if ( ! defined('ABSPATH') ) { exit; }

/**
 * Capture extensions.app_fpf.values from POST /wc/store/v1/cart/add-item
 * and store on the cart item array under APP_FPF_NS.
 * Also log to WooCommerce logs so you can verify receipt.
 */
add_filter('woocommerce_store_api_add_to_cart_data', function( $cart_item_data, $request ) {

  // Pull JSON safely from the Store API request
  $json = is_callable([$request, 'get_json_params'])
    ? (array) $request->get_json_params()
    : (array) $request->get_params();

  $ext = $json['extensions'] ?? null;
  $vals = (is_array($ext) && isset($ext[APP_FPF_NS]['values']) && is_array($ext[APP_FPF_NS]['values']))
    ? $ext[APP_FPF_NS]['values']
    : null;

  // Log everything we need to debug
  $logger = wc_get_logger();
  $logger->info( 'add_to_cart payload: ' . wp_json_encode($json), ['source' => 'app-fpf'] );

  if ( is_array($vals) ) {
    // Minimal: just attach raw values (you can sanitize later)
    $cart_item_data[ APP_FPF_NS ] = $vals;

    $logger->info( 'app_fpf.values received: ' . wp_json_encode($vals), ['source' => 'app-fpf'] );
  } else {
    $logger->warning( 'app_fpf.values missing or not an object', ['source' => 'app-fpf'] );
  }

  return $cart_item_data;
}, 10, 2 );
