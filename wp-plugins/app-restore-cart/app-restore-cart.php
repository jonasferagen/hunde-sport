<?php

/**
 * Plugin Name: Mobile Cart Restore
 * Description: Allows mobile apps to restore a users cart using a cart token.
 * Version: 0.1.0
 * Author: Hunde-sport.no
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

add_action('rest_api_init', function () {
    register_rest_route('custom/v1', '/cart-restore-token', [
        'methods'  => 'POST',
        'callback' => 'create_cart_restore_token_rest',
        'permission_callback' => '__return_true',
    ]);
});

function create_cart_restore_token_rest( WP_REST_Request $request ) {
    $jwt_token = sanitize_text_field( (string) $request->get_header('cart-token') );
    if ( !$jwt_token ) {
        return new WP_Error('no_token', 'Missing cart token', ['status' => 400]);
    }

    // Call Store API internally (no HTTP)
    $req = new WP_REST_Request('GET', '/wc/store/v1/cart');
    $req->set_header('cart-token', $jwt_token);
    $res = rest_do_request($req);
    if ( $res->is_error() ) {
        return new WP_Error('api_error', 'Failed to fetch cart data', ['status' => 500]);
    }
    $cart_data = $res->get_data();
    if ( empty($cart_data) || isset($cart_data['code']) ) {
        return new WP_Error('invalid_cart', 'Invalid cart data or expired token', ['status' => 400]);
    }

    $restore_token = wp_generate_password(32, false);
    set_transient('cart_restore_' . $restore_token, $cart_data, MINUTE_IN_SECONDS * 5);

    return rest_ensure_response([
        'success' => true,
        'restore_token' => $restore_token,
        'expires_in' => 300,
    ]);
}

add_action('wp', function () {
    if ( is_checkout() && isset($_GET['restore_token']) ) {
        $restore_token = sanitize_text_field( (string) $_GET['restore_token'] );
        $cart_data = get_transient('cart_restore_' . $restore_token);

        if ( $cart_data && isset($cart_data['items']) && is_array($cart_data['items']) ) {
            WC()->cart->empty_cart();

            foreach ( $cart_data['items'] as $item ) {
                $product_id   = (int) ($item['id'] ?? 0);
                $quantity     = (int) ($item['quantity'] ?? 1);
                $variation_id = (int) ($item['variation_id'] ?? 0);
                $variation    = is_array( $item['variation'] ?? null ) ? $item['variation'] : [];
            
                $cart_item_data = [];

                // Carry ALL extension values generically
                if ( isset($item['extensions']) && is_array($item['extensions']) ) {
                    foreach ( $item['extensions'] as $ns => $payload ) {
                        if ( is_array($payload) && isset($payload['values']) && is_array($payload['values']) ) {
                            $cart_item_data[ $ns ] = wc_clean( $payload['values'] ); // recursive clean
                        }
                    }
                }
                
            
                // Add to cart; if fails, skip rather than fatally breaking checkout
                $added = WC()->cart->add_to_cart( $product_id, $quantity, $variation_id, $variation, $cart_item_data );
                if ( ! $added ) {
                    // If you want a breadcrumb during testing:
                    // error_log( "Restore: add_to_cart failed for product_id={$product_id}" );
                    continue;
                }
            }
            
            delete_transient('cart_restore_' . $restore_token);
            wp_redirect( wc_get_checkout_url() );
            exit;
        }
    }
});
