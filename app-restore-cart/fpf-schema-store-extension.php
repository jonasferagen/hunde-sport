<?php
/**
 * Plugin Name: HS FPF Adapter (read Flexible Product Fields per product)
 * Description: Exposes GET /wp-json/hs/v1/products/<id>/fpf-fields with a sanitized schema your headless app can render.
 * Version: 1.0.0
 */

defined('ABSPATH') || exit;

add_action('rest_api_init', function () {
    register_rest_route('hs/v1', '/products/(?P<id>\d+)/fpf-fields', [
        'methods'  => 'GET',
        'callback' => 'hs_fpf_get_fields_for_product',
        'args'     => [
            'id' => [
                'validate_callback' => fn($param) => is_numeric($param) && $param > 0,
            ],
        ],
        'permission_callback' => '__return_true', // public read
    ]);
});

/**
 * GET callback: returns a compact field schema for a single product.
 * Strategy:
 *  1) Try FPF's own REST (server-side) and map to a neutral schema.
 *  2) If unavailable, return a 501 with a helpful message.
 */
function hs_fpf_get_fields_for_product( WP_REST_Request $req ) {
    $product_id = (int) $req['id'];

    // 1) Try to use FPF's internal REST if present.
    //   - Route can vary between versions; two common patterns are shown below.
    //   - We attempt them in order and pick the first 200 OK.
    $candidate_routes = [
        // Hypothetical "fields for a product" route (adjust if your site shows a different one).
        "/flexible-product-fields/v1/products/$product_id/fields",
        // Fallback: fetch all groups then filter by product server-side (heavier).
        "/flexible-product-fields/v1/groups",
    ];

    $fpf_resp = null;
    foreach ( $candidate_routes as $path ) {
        $fpf_req = new WP_REST_Request( 'GET', $path );
        // Run server-side so perms don’t rely on the client.
        $resp = rest_do_request( $fpf_req );
        if ( $resp instanceof WP_REST_Response ) {
            $status = $resp->get_status();
            if ( $status >= 200 && $status < 300 ) {
                $fpf_resp = $resp->get_data();
                break;
            }
        }
    }

    if ( ! $fpf_resp ) {
        // If FPF REST is not available or blocked, bail with a clear message.
        return new WP_Error(
            'hs_fpf_no_backend',
            __('Flexible Product Fields REST data not available. Expose a readable source or map groups via code.', 'hs'),
            [ 'status' => 501 ]
        );
    }

    // 2) Map FPF’s raw payload -> compact, stable schema for the client.
    //    Because FPF payloads vary by version, we defensively normalize keys.
    $schema = hs_fpf_normalize_schema( $fpf_resp, $product_id );

    // 3) (Optional) Cache for a short time to reduce load.
    // set_transient("hs_fpf_schema_$product_id", $schema, MINUTE_IN_SECONDS * 5);

    return rest_ensure_response( [
        'product_id' => $product_id,
        'fields'     => $schema['fields'],
        'pricing'    => $schema['pricing'] ?? [],
        'version'    => $schema['version'] ?? null,
    ] );
}

/**
 * Normalize arbitrary FPF data into a predictable structure:
 * [
 *   fields: [
 *     { id, name, type, label, required, placeholder, help, min, max, options: [{value,label}], rules: {...} }
 *   ],
 *   pricing: [{ field, mode, amount, currency }],
 *   version: "fpf:x.y"
 * ]
 */
function hs_fpf_normalize_schema( $raw, $product_id ) {
    $out = [
        'fields'  => [],
        'pricing' => [],
        'version' => 'fpf:unknown',
    ];

    // Common FPF field types we care about:
    $map_types = [
        'text'        => 'text',
        'textarea'    => 'textarea',
        'select'      => 'select',
        'radio'       => 'radio',
        'checkbox'    => 'checkbox',
        'number'      => 'number',
        'email'       => 'email',
        'file'        => 'file',
        'color'       => 'color',
        'date'        => 'date',
    ];

    // Heuristic mapping — adjust once you inspect your site’s exact FPF JSON.
    $groups = [];
    if ( isset($raw['groups']) && is_array($raw['groups']) ) {
        $groups = $raw['groups'];
        $out['version'] = $raw['version'] ?? $out['version'];
    } elseif ( is_array($raw) ) {
        // Some installs may already return a flat array of groups/fields.
        $groups = $raw;
    }

    foreach ( $groups as $group ) {
        $fields = $group['fields'] ?? $group['items'] ?? [];
        foreach ( $fields as $f ) {
            $type  = strtolower( $f['type'] ?? $f['field_type'] ?? 'text' );
            $id    = (string)($f['id'] ?? $f['uid'] ?? $f['name'] ?? wp_generate_uuid4());
            $name  = (string)($f['name'] ?? $f['slug'] ?? $id);
            $label = (string)($f['label'] ?? $f['title'] ?? $name);

            $entry = [
                'id'          => $id,
                'name'        => $name,
                'type'        => $map_types[$type] ?? 'text',
                'label'       => $label,
                'required'    => (bool)($f['required'] ?? $f['validate_required'] ?? false),
                'placeholder' => (string)($f['placeholder'] ?? ''),
                'help'        => (string)($f['description'] ?? $f['help'] ?? ''),
                'min'         => isset($f['min']) ? (int)$f['min'] : null,
                'max'         => isset($f['max']) ? (int)$f['max'] : null,
                'options'     => [],
                'rules'       => [
                    // Space for conditional logic/visibility rules if FPF returns them
                    'visible' => true,
                ],
            ];

            // Options for select/radio/checkbox
            $choices = $f['options'] ?? $f['choices'] ?? [];
            if ( is_array($choices) ) {
                foreach ( $choices as $opt ) {
                    // Handle both associative and object-ish shapes
                    if ( is_array($opt) ) {
                        $entry['options'][] = [
                            'value' => (string)($opt['value'] ?? $opt['id'] ?? $opt['slug'] ?? ''),
                            'label' => (string)($opt['label'] ?? $opt['name'] ?? ''),
                        ];
                    } else {
                        $entry['options'][] = [ 'value' => (string)$opt, 'label' => (string)$opt ];
                    }
                }
            }

            // Optional: pricing rules per field (flat add-on, percentage, etc.)
            if ( isset($f['price']) || isset($f['pricing']) ) {
                $out['pricing'][] = [
                    'field'    => $name,
                    'mode'     => $f['pricing']['mode'] ?? 'flat',
                    'amount'   => (float)($f['price'] ?? $f['pricing']['amount'] ?? 0),
                    'currency' => get_woocommerce_currency(),
                ];
            }

            $out['fields'][] = $entry;
        }
    }

    return $out;
}
