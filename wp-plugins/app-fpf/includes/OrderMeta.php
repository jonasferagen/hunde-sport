<?php
if ( ! defined('ABSPATH') ) { exit; }

/**
 * Copy app_fpf values from cart line -> order line meta at checkout.
 */
add_action('woocommerce_checkout_create_order_line_item', function( $item, $cart_item_key, $values, $order ) {
  if ( isset($values[ APP_FPF_NS ]) && is_array($values[ APP_FPF_NS ]) ) {
    // Save once as JSON; easy to consume later in fulfillment.
    $item->add_meta_data( APP_FPF_NS, wp_json_encode( $values[ APP_FPF_NS ] ), true );
  }
}, 10, 4);
