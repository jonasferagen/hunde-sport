<?php
/**
 * Plugin Name: Hundesport.no Woo Proxy
 * Description: Woocommerce proxy for native app
 * Version: 1.0.0
 * Author: Jonas Feragen <jonas.feragen@gmail.com>
 */

add_action('rest_api_init', function () {
 
    // Reset Cart
    register_rest_route('hundesport/v1', '/cart-fill', [
        'methods' => 'GET',
        'callback' => 'hundesport_fill_cart',
        'permission_callback' => '__return_true',
    ]);
});

add_filter('woocommerce_store_api_product_categories_query', function ($args, $request) {
    if (isset($request['parent'])) {
        $args['parent'] = (int) $request['parent'];
    }
    print_r($args, true);
    die;
    return $args;
}, 10, 2);


function hundesport_fill_cart($request) {

    if (!function_exists('WC') || !WC()->cart) {
        return new WP_Error('woocommerce_unavailable', 'WooCommerce not loaded', ['status' => 500]);
    }

    if (null === WC()->session) {
        WC()->initialize_session();
    }

    if (null === WC()->customer) {
        WC()->customer = new \WC_Customer(0); // Guest
    }

    WC()->cart->empty_cart();

    // Format: ?cart_fill=1&items=243987:1,123456:2
    $items_param = sanitize_text_field($request->get_param('items') ?: '');
    $items = explode(',', $items_param);

    foreach ($items as $item) {
        [$product_id, $qty] = array_map('intval', explode(':', $item) + [0, 1]);
        if ($product_id > 0 && $qty > 0) {
            WC()->cart->add_to_cart($product_id, $qty);
        }
    }
    // Redirect to checkout
    wp_safe_redirect(wc_get_checkout_url(), 302);
    exit;
}
