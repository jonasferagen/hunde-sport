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
	// Sanitize header (JWT-like, but treat as opaque)
	$jwt_token = sanitize_text_field( wp_unslash( (string) $request->get_header('cart-token') ) );
	if ( $jwt_token === '' ) {
		return new WP_Error( 'no_token', 'Missing cart token', [ 'status' => 400 ] );
	}

	// Call Store API internally (no external HTTP)
	$req = new WP_REST_Request( 'GET', '/wc/store/v1/cart' );
	$req->set_header( 'cart-token', $jwt_token );
	$res = rest_do_request( $req );

	// Hardened error handling
	if ( is_wp_error( $res ) ) {
		return new WP_Error( 'api_error', 'Failed to fetch cart data', [ 'status' => 500 ] );
	}
	if ( ! ( $res instanceof WP_REST_Response ) ) {
		return new WP_Error( 'api_error', 'Unexpected response from Store API', [ 'status' => 500 ] );
	}

	$cart_data = $res->get_data();

	// Validate shape (must be an array and not an error payload)
	if ( ! is_array( $cart_data ) || isset( $cart_data['code'] ) ) {
		return new WP_Error( 'invalid_cart', 'Invalid cart data or expired token', [ 'status' => 400 ] );
	}

	// Embed the original cart-token so later steps (linking/cleanup) can reference it.
	// Use a namespaced key to avoid collisions with Store API fields.
	$cart_data['_app_store_cart_token'] = $jwt_token;

	$restore_token = wp_generate_password( 32, false );

	// Store the payload for a short time only
	set_transient( 'app_fpf_cart_restore_' . $restore_token, $cart_data, APP_FPF_RESTORE_TTL );

	return rest_ensure_response( [
		'success'       => true,
		'restore_token' => $restore_token,
		'expires_in'    => (int) APP_FPF_RESTORE_TTL,
	] );
}

/**
 * On checkout with ?restore_token=..., rebuild the Woo cart from the stored Store API cart payload.
 *
 * Note: This is generic for any extension namespace; it carries all `extensions.*.values`
 * back into `$cart_item_data[$namespace] = values`, which our FPF code already persists.
 */add_action('wp', function () {
	if ( ! is_checkout() || ! isset($_GET['restore_token']) ) {
		return;
	}

	$restore_token = sanitize_text_field( wp_unslash( (string) $_GET['restore_token'] ) );
	if ( $restore_token === '' ) {
		return;
	}

	$cart_data = get_transient( 'app_fpf_cart_restore_' . $restore_token );
	if ( ! is_array($cart_data) || empty($cart_data['items']) || ! is_array($cart_data['items']) ) {
		return;
	}

	// Start clean
	WC()->cart->empty_cart();

	foreach ( $cart_data['items'] as $raw_item ) {
		$item = is_array($raw_item) ? $raw_item : (array) $raw_item;

		$product_id   = absint( $item['id'] ?? 0 );
		$quantity     = max( 1, absint( $item['quantity'] ?? 1 ) );
		$variation_id = absint( $item['variation_id'] ?? 0 );

		// Sanitize variation array (attribute_pa_* => value)
		$variation = [];
		if ( ! empty( $item['variation'] ) && is_array( $item['variation'] ) ) {
			foreach ( $item['variation'] as $attr => $value ) {
				$attr_key = wc_clean( (string) $attr );
				$variation[ $attr_key ] = wc_clean( (string) $value );
			}
		}

		$cart_item_data = [];

		// Carry extensions.*.values (sanitized)
		if ( ! empty( $item['extensions'] ) && is_array( $item['extensions'] ) ) {
			foreach ( $item['extensions'] as $ns => $payload ) {
				if ( is_object( $payload ) ) {
					$payload = (array) $payload;
				}
				if ( is_array( $payload ) && isset( $payload['values'] ) && is_array( $payload['values'] ) ) {
					// wc_clean() handles arrays recursively
					$cart_item_data[ $ns ] = wc_clean( $payload['values'] );
				}
			}
		}

		// Add to cart; continue on failure (unchanged behavior)
		$added_key = WC()->cart->add_to_cart( $product_id, $quantity, $variation_id, $variation, $cart_item_data );
		if ( ! $added_key ) {
			continue;
		}
	}

	$store_cart_token = isset($cart_data['_app_store_cart_token'])
		? sanitize_text_field( (string) $cart_data['_app_store_cart_token'] )
		: '';

	if ( $store_cart_token !== '' && WC()->session ) {
		$wc_session_id = (string) WC()->session->get_customer_id();
		if ( $wc_session_id !== '' ) {
			// Keep the link for a short period (e.g., 2 days). Adjust as you like.
			set_transient(
				'app_cart_link_' . md5($store_cart_token),
				[
					'wc_session' => $wc_session_id,
					'created'    => time(),
				],
				DAY_IN_SECONDS * 2
			);
		}
	}

	// One-time use
	delete_transient( 'app_fpf_cart_restore_' . $restore_token );

	// Reload checkout without changing the existing flow
	wp_safe_redirect( wc_get_checkout_url() );
	exit;
});
