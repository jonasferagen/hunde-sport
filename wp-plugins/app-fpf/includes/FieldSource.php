<?php
if ( ! defined('ABSPATH') ) { exit; }

/** Does FPF group target the product? (lenient parser, works with arrays/serialized/etc.) */
function app_fpf_group_targets_product( int $group_id, int $product_id ): bool {
  $all = get_post_meta( $group_id ); // meta_key => [values...]
  if ( empty($all) ) return false;

  foreach ( $all as $values ) {
    foreach ( (array) $values as $val ) {
      if ( is_array($val) && in_array( $product_id, array_map('intval', $val), true ) ) return true;
      if ( is_string($val) ) {
        if ( strpos( $val, '"' . $product_id . '"' ) !== false ) return true; // "...123..."
        if ( strpos( $val, 'i:' . $product_id ) !== false ) return true;      // i:123;
        if ( $val === (string) $product_id ) return true;                      // "123"
      }
    }
  }
  return false;
}

/** All FPF groups that target a product */
function app_fpf_groups_for_product( int $product_id ): array {
  $groups = get_posts([
    'post_type'      => APP_FPF_POST_TYPE,
    'post_status'    => 'publish',
    'posts_per_page' => -1,
    'fields'         => 'ids',
  ]);
  if ( empty($groups) ) return [];
  return array_values( array_filter( $groups, fn($gid) => app_fpf_group_targets_product( (int)$gid, $product_id ) ) );
}

/** Map one group's _fields meta to normalized items */
function app_fpf_map_fields_from_group( int $group_id ): array {
  $raw = get_post_meta( $group_id, APP_FPF_FIELDS_META, true );
  if ( !is_array($raw) ) return [];

  $out = [];
  $i = 0;
  foreach ( $raw as $f ) {
    $i++;
    $key      = isset($f['name']) ? sanitize_key($f['name'])
              : (isset($f['key']) ? sanitize_key($f['key']) : 'line_'.$i);
    $label    = isset($f['label']) ? wp_strip_all_tags($f['label']) : ('Linje '.$i);
    $required = !empty($f['required']);
    $maxlen   = isset($f['max_length']) ? (int)$f['max_length'] : 40;
    $lines    = isset($f['lines']) ? (int)$f['lines'] : 1;

    $out[] = [
      'key'      => $key,
      'label'    => $label,
      'required' => $required,
      'maxlen'   => $maxlen,
      'lines'    => $lines,
    ];
  }
  return $out;
}

/** Merge fields from all matching groups */
function app_fpf_get_fields_for_product( int $product_id ): array {
  $groups = app_fpf_groups_for_product( $product_id );
  if ( empty($groups) ) return [];
  $fields = [];
  foreach ( $groups as $gid ) {
    $fields = array_merge( $fields, app_fpf_map_fields_from_group( (int)$gid ) );
  }
  return $fields;
}
