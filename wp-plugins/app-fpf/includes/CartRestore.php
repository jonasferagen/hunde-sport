<?php
if ( ! defined('ABSPATH') ) { exit; }

/**
 * Cart restore endpoint + checkout-time restore using a short-lived token.
 * - POST /wp-json/custom/v1/cart-restore-token
 *   Header: cart-token: <store-api-cart-token>
 *   -> returns { restore_token, expires_in }
 *
 * - On checkout page: ?restore_token=...  will rebuild the cart and reload checkout.
 */

if ( ! defined('APP_FPF_RESTORE_TTL') ) {
	// 5 minutes is fine; adjust if the app needs more time to handoff
	define('APP_FPF_RESTORE_TTL', 5 * MINUTE_IN_SECONDS);
}

add_action('rest_api_init', function () {
	register_rest_route('custom/v1', '/cart-restore-token', [
		'methods'             => 'POST',
		'callback'            => 'app_fpf_create_cart_restore_token_rest',
		'permission_callback' => '__return_true', // you can tighten this later if needed
	]);
});

/**
 * Create a short-lived restore token for the current Store API cart (identified by cart-token header).
 */
function app_fpf_create_cart_restore_token_rest( WP_REST_Request $request ) {
	$jwt_token = sanitize_text_field( (string) $request->get_header('cart-token') );
	if ( ! $jwt_token ) {
		return new WP_Error('no_token', 'Missing cart token', ['status' => 400]);
	}

	// Call Store API internally (no external HTTP)
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
	set_transient('app_fpf_cart_restore_' . $restore_token, $cart_data, APP_FPF_RESTORE_TTL);

	return rest_ensure_response([
		'success'       => true,
		'restore_token' => $restore_token,
		'expires_in'    => APP_FPF_RESTORE_TTL,
	]);
}

/**
 * On checkout with ?restore_token=..., rebuild the Woo cart from the stored Store API cart payload.
 *
 * Note: This is generic for any extension namespace; it carries all `extensions.*.values`
 * back into `$cart_item_data[$namespace] = values`, which our FPF code already persists.
 */
add_action('wp', function () {
	if ( ! is_checkout() || empty($_GET['restore_token']) ) {
		return;
	}

	$restore_token = sanitize_text_field( (string) $_GET['restore_token'] );
	$cart_data     = get_transient('app_fpf_cart_restore_' . $restore_token);

	if ( ! $cart_data || empty($cart_data['items']) || ! is_array($cart_data['items']) ) {
		return;
	}

	// Start clean
	WC()->cart->empty_cart();

	foreach ( $cart_data['items'] as $item ) {
		$product_id   = (int) ($item['id'] ?? 0);
		$quantity     = (int) ($item['quantity'] ?? 1);
		$variation_id = (int) ($item['variation_id'] ?? 0);

		// Variation array from Store API is already normalized as attribute_pa_* => value
		$variation    = is_array( $item['variation'] ?? null ) ? $item['variation'] : [];

		$cart_item_data = [];

		// Carry ALL extension values generically (keeps this file decoupled from app_fpf)
		if ( ! empty($item['extensions']) && is_array($item['extensions']) ) {
			foreach ( $item['extensions'] as $ns => $payload ) {
				if ( is_array($payload) && isset($payload['values']) && is_array($payload['values']) ) {
					$cart_item_data[ $ns ] = wc_clean( $payload['values'] ); // recursive
				}
			}
		}

		// Add to cart; continue on failure (don't kill checkout)
		$added_key = WC()->cart->add_to_cart( $product_id, $quantity, $variation_id, $variation, $cart_item_data );
		if ( ! $added_key ) {
			continue;
		}
	}

	// One-time use
	delete_transient('app_fpf_cart_restore_' . $restore_token);

	// Reload checkout without the token param
	wp_safe_redirect( wc_get_checkout_url() );
	exit;
});
