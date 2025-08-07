<?php

/**
 * Plugin Name: Mobile Cart Restore
 * Description: Allows mobile apps to restore a users cart using a cart token.
 * Version: 1.0
 * Author: Hunde-sport.no
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}


add_action('rest_api_init', function () {
    register_rest_route('custom/v1', '/cart-restore-token', array(
        'methods' => 'POST',
        'callback' => 'create_cart_restore_token_rest',
        'permission_callback' => '__return_true', // Allow public access
        'args' => array(
            'jwt_token' => array(
                'required' => true,
                'type' => 'string',
                'sanitize_callback' => 'sanitize_text_field',
            ),
        ),
    ));
});

function create_cart_restore_token_rest(WP_REST_Request $request) {
    $jwt_token = $request->get_param('jwt_token');
    
    // Make an internal API call using the JWT to get cart contents
    $response = wp_remote_get(home_url('/wp-json/wc/store/v1/cart'), [
        'headers' => [
            'Cart-Token' => $jwt_token
        ]
    ]);
    
    if (is_wp_error($response)) {
        return new WP_Error('api_error', 'Failed to fetch cart data', array('status' => 500));
    }
    
    $cart_data = json_decode(wp_remote_retrieve_body($response), true);
    
    if (empty($cart_data) || isset($cart_data['code'])) {
        return new WP_Error('invalid_cart', 'Invalid cart data or expired token', array('status' => 400));
    }
    
    // Create simple restore token
    $restore_token = wp_generate_password(32, false);
    set_transient('cart_restore_' . $restore_token, $cart_data, 300); // 5 minutes
    
    return rest_ensure_response([
        'success' => true,
        'restore_token' => $restore_token,
        'expires_in' => 300 // 5 minutes
    ]);
}

add_action('wp', function() {
    if (is_checkout() && isset($_GET['restore_token'])) {
        $restore_token = sanitize_text_field($_GET['restore_token']);
        $cart_data = get_transient('cart_restore_' . $restore_token);
        
        if ($cart_data && isset($cart_data['items'])) {
            // Clear current cart
            WC()->cart->empty_cart();
            
            // Restore items
            foreach ($cart_data['items'] as $item) {
                WC()->cart->add_to_cart(
                    $item['id'],
                    $item['quantity'],
                    $item['variation_id'] ?? 0,
                    $item['variation'] ?? []
                );
            }
            
            // Delete the token (one-time use)
            delete_transient('cart_restore_' . $restore_token);
            
            // Redirect to clean checkout URL
            wp_redirect(wc_get_checkout_url());
            exit;
        }
    }
});