<?php
function hundesport_map_category($term) {
    return [
        'id' => (int) $term->term_id,
        'name' => $term->name,
        'parent' => (int) $term->parent,
        'image' => function_exists('get_term_meta') ? [
            'src' => get_term_meta($term->term_id, 'thumbnail_id', true)
                ? wp_get_attachment_url(get_term_meta($term->term_id, 'thumbnail_id', true))
                : null,
        ] : null,
        'description' => $term->description,
    ];
}

function hundesport_map_product($p) {
    return [
        'id' => $p->get_id(),
        'name' => $p->get_name(),
        'price' => (float) $p->get_price(),
        'regular_price' => (float) $p->get_regular_price(),
        'sale_price' => (float) $p->get_sale_price(),
        'on_sale' => $p->is_on_sale(),
        'featured' => $p->get_featured(),
        'stock_status' => $p->get_stock_status(),
        'description' => $p->get_description(),
        'short_description' => $p->get_short_description(),
        'categories' => array_map('hundesport_map_category', array_map('get_term', $p->get_category_ids(), array_fill(0, count($p->get_category_ids()), 'product_cat'))),
        'images' => array_map(function($img) {
            return [
                'id' => $img['id'],
                'src' => $img['src'],
                'alt' => $img['alt'],
            ];
        }, $p->get_gallery_image_ids() ? array_map(function($id) {
            return [
                'id' => $id,
                'src' => wp_get_attachment_url($id),
                'alt' => get_post_meta($id, '_wp_attachment_image_alt', true),
            ];
        }, $p->get_gallery_image_ids()) : [
            [
                'id' => $p->get_image_id(),
                'src' => wp_get_attachment_url($p->get_image_id()),
                'alt' => get_post_meta($p->get_image_id(), '_wp_attachment_image_alt', true),
            ]
        ]),
        'attributes' => array_map(function($attr) {
            return [
                'name' => $attr->get_name(),
                'options' => $attr->get_options(),
            ];
        }, $p->get_attributes() ? $p->get_attributes() : []),
        'variations' => $p->is_type('variable') ? $p->get_children() : [],
        'related_ids' => $p->get_related(),
        'type' => $p->get_type(),
        'default_attributes' => method_exists($p, 'get_default_attributes') ? array_map(function($key, $value) {
            return ['name' => $key, 'option' => $value];
        }, array_keys($p->get_default_attributes()), $p->get_default_attributes()) : [],
        'parent_id' => $p->get_parent_id(),
    ];
}
