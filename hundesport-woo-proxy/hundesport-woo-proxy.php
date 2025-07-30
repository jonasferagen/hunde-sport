<?php
/**
 * Plugin Name: Hundesport.no Woo Proxy
 * Description: Woocommerce proxy for native app
 * Version: 1.0.6
 * Author: Jonas Feragen <jonas.feragen@gmail.com>
 */

require_once __DIR__ . '/includes/mappers.php';


add_action('rest_api_init', function () {
    // Categories
    
    register_rest_route('hundesport/v1', '/categories', [
        'methods' => 'GET',
        'callback' => 'hundesport_get_categories',
        'permission_callback' => '__return_true',
    ]);
  
    register_rest_route('hundesport/v1', '/categories/(?P<id>\d+)', [
        'methods' => 'GET',
        'callback' => 'hundesport_get_category',
        'permission_callback' => '__return_true',
    ]);
    // Products
    register_rest_route('hundesport/v1', '/products', [
        'methods' => 'GET',
        'callback' => 'hundesport_get_products',
        'permission_callback' => '__return_true',
    ]);
    register_rest_route('hundesport/v1', '/products/(?P<id>\d+)', [
        'methods' => 'GET',
        'callback' => 'hundesport_get_product',
        'permission_callback' => '__return_true',
    ]);
    // Variations
    register_rest_route('hundesport/v1', '/products/(?P<id>\d+)/variations', [
        'methods' => 'GET',
        'callback' => 'hundesport_get_product_variations',
        'permission_callback' => '__return_true',
    ]);

    // Reset Cart
    register_rest_route('hundesport/v1', '/cart-fill', [
        'methods' => 'GET',
        'callback' => 'hundesport_fill_cart',
        'permission_callback' => '__return_true',
    ]);
});

// --- Handlers ---

function hundesport_get_categories(WP_REST_Request $request) {
    $per_page = (int) ($request->get_param('per_page') ?: 10);
    $page     = (int) ($request->get_param('page') ?: 1);
    $offset   = ($page - 1) * $per_page;

    $args = [
        'taxonomy' => 'product_cat',
        'hide_empty' => true,
        'orderby' => 'name',
        'order' => 'ASC',
        'number' => $per_page,
        'offset' => $offset,
    ];
    // ✅ Add parent filter if provided
    if (!is_null($request->get_param('parent'))) {
        $args['parent'] = (int) $request->get_param('parent');
    }


    $terms = get_terms($args);
    $data = array_values(array_map('hundesport_map_category', $terms));
    return rest_ensure_response($data);
}

function hundesport_get_category($request) {
    $id = (int) $request['id'];
    $term = get_term($id, 'product_cat');
    return rest_ensure_response(hundesport_map_category($term) ?: new WP_Error('not_found', 'Category not found', ['status' => 404]));
}

function hundesport_get_products($request) {
    $per_page = (int) ($request->get_param('per_page') ?: 10);
    $page     = (int) ($request->get_param('page') ?: 1);
    $offset   = ($page - 1) * $per_page;

    $args = [
        'status' => 'publish',
        'limit' => $per_page,
        'offset' => $offset,
    ];

    // ✅ Order by date for recent
    if ($orderby = $request->get_param('orderby')) {
        $args['orderby'] = $orderby;
    }

    // ✅ Featured products
    if ($request->get_param('featured') === 'true') {
        $args['featured'] = true;
    }

    // ✅ Discounted / on sale
    if ($request->get_param('on_sale') === 'true') {
        $args['on_sale'] = true;
    }

    // ✅ Search by keyword
    if ($search = $request->get_param('search')) {
        $args['s'] = sanitize_text_field($search);
    }

    // ✅ Filter by category slug or ID
    if ($category = $request->get_param('category')) {
        $args['category'] = [$category]; // Woo handles both ID or slug
    }

    // ✅ Filter by included IDs
    if ($include = $request->get_param('include')) {
        $ids = array_map('intval', explode(',', $include));
        $args['include'] = $ids;
    }

    $products = wc_get_products($args);
    $data = array_map('hundesport_map_product', $products);
    return rest_ensure_response(array_values($data));
}

    

function hundesport_get_product($request) {
    $id = (int) $request['id'];
    $product = wc_get_product($id);
    if (!$product) {
        return new WP_Error('not_found', 'Product not found', ['status' => 404]);
    }
    return rest_ensure_response(hundesport_map_product($product));
}


function hundesport_get_product_variations($request) {
    $id = (int) $request['id'];
    $product = wc_get_product($id);
    if (!$product || !$product->is_type('variable')) {
        return rest_ensure_response([]);
    }

    $per_page = (int) ($request->get_param('per_page') ?: 10);
    $page     = (int) ($request->get_param('page') ?: 1);
    $offset   = ($page - 1) * $per_page;

    $children = $product->get_children(); // all variation IDs
    $paged_children = array_slice($children, $offset, $per_page);

    $variations = array_map(function($vid) {
        $var = wc_get_product($vid);
        return $var ? hundesport_map_product($var) : null;
    }, $paged_children);

    return rest_ensure_response(array_values(array_filter($variations)));
}

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

