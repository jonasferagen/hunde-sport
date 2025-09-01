<?php
if ( ! defined('ABSPATH') ) { exit; }

/**
 * Copy app_fpf values from cart line -> order line meta at checkout,
 * using the FPF field LABELS as meta keys (e.g. "Linje 1"), just like the webshop flow.
 *
 * Also saves a single JSON blob under meta key "app_fpf" for debugging/audits.
 */
add_action('woocommerce_checkout_create_order_line_item', function( $item, $cart_item_key, $values, $order ) {

	// 1) Ensure we have values from the cart line.
	if ( empty( $values['app_fpf'] ) || ! is_array( $values['app_fpf'] ) ) {
		return; // nothing to do
	}
	$app_values = $values['app_fpf'];

	// 2) Resolve product/variation id for field lookup.
	$product_id = (int) $item->get_variation_id();
	if ( ! $product_id ) {
		$product_id = (int) $item->get_product_id();
	}

	// 3) Load field config (so we can translate key -> label).
	if ( ! function_exists( 'app_fpf_get_fields_for_product' ) ) {
		// If helpers aren't loaded for some reason, at least store the JSON.
		$item->add_meta_data( 'app_fpf', wp_json_encode( $app_values ), true );
		return;
	}
	$fields = app_fpf_get_fields_for_product( $product_id ); // array of ['key','label','required','maxlen','lines']

	// 4) Build key->label map.
	$key_to_label = [];
	if ( is_array($fields) ) {
		foreach ( $fields as $f ) {
			$k = isset($f['key']) ? (string) $f['key'] : '';
			if ( $k === '' ) continue;
			$label = isset($f['label']) ? wp_strip_all_tags( (string) $f['label'] ) : '';
			$key_to_label[ $k ] = $label !== '' ? $label : ucfirst( str_replace('_',' ', $k) );
		}
	}

	// 5) Write individual meta rows using the LABELS (exactly like FPF does).
	foreach ( $app_values as $k => $val ) {
		// Only write known keys (present in product config), to mirror FPF behavior.
		if ( ! isset( $key_to_label[ $k ] ) ) {
			continue;
		}
		$label = $key_to_label[ $k ];

		$clean = wc_clean( is_scalar($val) ? (string) $val : wp_json_encode( $val ) );

		// If product config defines maxlen for this key, trim to it.
		if ( is_array($fields) ) {
			foreach ( $fields as $f ) {
				if ( isset($f['key']) && $f['key'] === $k && isset($f['maxlen']) && is_numeric($f['maxlen']) ) {
					$clean = mb_substr( $clean, 0, (int) $f['maxlen'] );
					break;
				}
			}
		}

		$item->add_meta_data( $label, $clean, true );
	}

	// 6) Also store a machine-readable blob for verification/audits.
	$item->add_meta_data( 'app_fpf', wp_json_encode( $app_values ), true );

	// 7) Optional: log what we wrote (enable once while testing, then remove/disable).
	if ( defined('WP_DEBUG') && WP_DEBUG ) {
		$logger = wc_get_logger();
		$logger->info(
			sprintf(
				'Order %d item %d: wrote FPF meta for product %d. keys=%s',
				$order->get_id(),
				$item->get_id(),
				$product_id,
				implode(',', array_keys($app_values))
			),
			['source' => 'app-fpf']
		);
	}

}, 999, 4);
