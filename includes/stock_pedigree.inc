<?php
/**
 * @file
 * Contains all functions relevant to the stock pedigree functionality.
 */

/**
 * API: check if this node would consist of a single level tree with no leaves.
 *
 * @param $stock_id
 *   The unique identifier of the root stock/germplasm.
 * @return
 *   TRUE if there are no approved relationships attached to the root node
 *   and FALSE otherwise.
 */
function tripald3_is_node_leafless_tree($stock_id) {

  $relationship_types = tripald3_get_pedigree_relationship_types();

  // Check relationships where the root is the subject.
  $subject_rels = 0;
  if (!empty($relationship_types['subject'])) {
    $vars = array(':stock_id' => $stock_id);
    $rel_placeholders = array();
    foreach ($relationship_types['subject'] as $k => $type_name) {
      $vars[':reltype' . $k] = $type_name;
      $rel_placeholders[] = ':reltype' . $k;
    }
    $sql = 'SELECT count(*) as num_relationships
            FROM {stock_relationship} sr
            LEFT JOIN {cvterm} cvt ON sr.type_id=cvt.cvterm_id
            WHERE subject_id=:stock_id
              AND cvt.name IN (' . implode(',', $rel_placeholders) . ')';
    $subject_rels = chado_query($sql, $vars)->fetchField();
  }

  // Check relationships where the root is the object.
  $object_rels = 0;
  if (!empty($relationship_types['object'])) {
    $vars = array(':stock_id' => $stock_id);
    $rel_placeholders = array();
    foreach ($relationship_types['object'] as $k => $type_name) {
      $vars[':reltype' . $k] = $type_name;
      $rel_placeholders[] = ':reltype' . $k;
    }
    $sql = 'SELECT count(*) as num_relationships
            FROM {stock_relationship} sr
            LEFT JOIN {cvterm} cvt ON sr.type_id=cvt.cvterm_id
            WHERE object_id=:stock_id
              AND cvt.name IN (' . implode(',', $rel_placeholders) . ')';
    $object_rels = chado_query($sql, $vars)->fetchField();
  }

  // If there are any relationships then return FALSE else return TRUE
  $total = $subject_rels + $object_rels;
  if ($total) {
    return FALSE;
  }
  else {
    return TRUE;
  }

}

/**
 * This is the preprocess hook for the stock pedigree template.
 */
function tripald3_preprocess_tripald3_stock_pedigree(&$vars) {

  // Add the JS and CSS needed for the template.
  tripald3_load_libraries();

  $jsSettings['tripalD3']['autoResize'] = variable_get('tripald3_autoResize', FALSE);
  drupal_add_js($jsSettings, 'setting');
}

/**
 * JSON callback for relationship data formatted for use with D3.js.
 */
function tripald3_get_relationship_json($base_table, $id) {

  drupal_add_http_header('Content-Type', 'application/json');
  drupal_add_http_header('Access-Control-Allow-Origin', "*");

  $relationships = tripald3_get_relationship_tree_data(
    $base_table,
    $id,
    array(
      'restrict relationships' => tripald3_get_pedigree_relationship_types()
    )
  );

  return drupal_json_output($relationships);
}

/**
 * Recursive Function to navigate relationship data stored in chado and return
 * it as a nested parent => child array.
 *
 * ASSUMPTION #1: In pedigree tree's the root is the child
 * without any children of it's own.
 */
function tripald3_get_relationship_tree_data($base_table, $id, $options = array(), $data = array()) {
  // Bio data resource alias.
  $bio_data = '/bio_data/';
  // URL.
  // host/bio_data/entity_id.
  $url = '%s%s%d';

  $rel_table = $base_table . '_relationship';
  $base_table_pkey = $base_table . '_id';

  $generate_var_options = array(
    'include_fk' => array()
  );

  // ROOT:
  // Get the root details if none were provided.
  $is_root = FALSE;

  if (empty($data)) {
    $is_root = TRUE;

    $root = chado_generate_var($base_table, array($base_table_pkey => $id), $generate_var_options);
    $root = chado_expand_var($root, 'node','stock');

    // Link of the root.
    $entity_id = tripald3_get_pedigree_entity_id($root->stock->stock_id, $root->stock->type_id);
    $root->url = ($entity_id == '#') ? $entity_id : sprintf($url, $GLOBALS['base_url'], $bio_data, $entity_id);

    $data = array(
      'current' => $root,
      'parent' => array('stock_id' => "null", 'name' => "null"),
      'children' => array(),
    );

    $data['current']->nid = $root->nid;
  }

  // CHILDREN:
  // Base Case: there are no additional relationships.
  if (!isset($data['children'])) {
    $data['children'] = array();
  }

  // Retrieve relationships where the passed in record is the object.
  $sql = 'SELECT
            r.subject_id,
            r.type_id,
            cvt.name as type,
            r.object_id
          FROM {' . $rel_table . '} r
          LEFT JOIN {cvterm} cvt ON cvt.cvterm_id=r.type_id
          WHERE ';

  if (isset($options['restrict relationships'])) {
    $where = array();
    if (isset($options['restrict relationships']['subject'])) {
      $where[] = "(r.object_id = :id AND cvt.name IN ('" . implode("', '", $options['restrict relationships']['object']) . "'))";
    }
    if (isset($options['restrict relationships']['object'])) {
      $where[] = "(r.subject_id = :id AND cvt.name IN ('" . implode("', '", $options['restrict relationships']['subject']) . "'))";
    }
  }
  else {
    $where[] = 'r.object_id=:id AND r.subject_id=:id';
  }

  $sql = $sql . implode(' OR ', $where) . ' ORDER BY cvt.name ASC';
  $rels = chado_query($sql , array(':id' => $id));

  foreach($rels as $i => $rel) {
    $subject = $object = $child = '';

    if ($rel->subject_id == $id) {
      $object  = $rel->object_id;
      $subject = $rel->subject_id;
    }
    else {
      $object  = $rel->subject_id;
      $subject = $rel->object_id;
    }

    $child = chado_generate_var($base_table, array('stock_id' => $object), $generate_var_options);
    $child = chado_expand_var($child, 'node','stock');

    if (isset($child->nid)) {
      $stock = $child->stock;
      $stock->nid = $child->nid;

      $stock_id = $child->stock->stock_id;
      $type_id  = $child->stock->type_id;
    }
    else {
      $stock = $child;

      $stock_id = $child->stock_id;
      $type_id  = $child->type_id;
    }

    // Add link.
    $entity_id = tripald3_get_pedigree_entity_id($stock_id, $type_id);
    $stock->stock->url = $stock->url = ($entity_id == '#')
      ? $entity_id
      : sprintf($url, $GLOBALS['base_url'], $bio_data, $entity_id);

    $subnode = array(
      'current' => $stock,
      'parent' => array(
        'parent_id' => $subject,
        'name' => $data['current']->name,
      ),
      'relationship' => $rel,
      'children' => array()
    );
    $subnode['relationship']->subject = $stock->name;
    $subnode['relationship']->object = $data['current']->name;

    // Now recursively add children.
    // NOTE: since we support folloing relationships from both directions
    // we need to be careful how we which id we recursively follow to ensure
    // we don't end up in an endless loop.
    $data['children'][] = tripald3_get_relationship_tree_data($base_table, $object, $options, $subnode);
  }

  // D3 assumes the first level will be an array of roots,
  // so we need to make that happen if we're at the root.
  if ($is_root) {
    $data = array(
      $data
    );
  }

  return $data;
}


/**
 *
 */
function tripald3_get_pedigree_relationship_types() {

  $rels_to_restrict = variable_get('tripald3_stock_pedigree_rels', NULL);
  if (!$rels_to_restrict) {

    // Get relationships used in stock table.
    $rels = array();
    $sql = "SELECT sr.type_id, cvt.name as type_name
            FROM {stock_relationship} sr
            LEFT JOIN {cvterm} cvt ON cvt.cvterm_id=sr.type_id
            GROUP BY sr.type_id, cvt.name
            ORDER BY count(sr.*) desc";
    $rel_query = chado_query($sql);
    foreach ($rel_query as $r) {
      $rels[$r->type_id] = $r->type_name;
    }

    $rels_to_restrict = array(
      'object' => array(),
      'subject' => $rels
    );
  }
  else {
    $rels_to_restrict = unserialize($rels_to_restrict);
  }

  return $rels_to_restrict;
}

/**
 * Function get entity id from tripal 3 content type.
 *
 * @param $stock_id
 *   Integer, stock_id from chado.stock table.
 * @param $type_id
 *   Integer, type id of stock corresponding to a term in chado.cvterm.
 *
 * @return
 *   Entity id or # or an blank anchor when entity id cannot be extracted.
 */
function tripald3_get_pedigree_entity_id($stock_id, $type_id) {
  // This character is also used to tell JS if node should be rendered as link or a text.
  $entity_id = '#';

  $m = db_query('SELECT t2.name
    FROM {tripal_term} AS t1 INNER JOIN {tripal_bundle} AS t2 ON t1.id = t2.term_id
    WHERE t1.accession = (
      SELECT t3.accession
      FROM chado.dbxref AS t3 INNER JOIN chado.cvterm AS t4 USING(dbxref_id)
      WHERE t4.cvterm_id = :stock_type)', array(':stock_type' => $type_id))
    ->fetchField();

  if ($m) {
    $chado_bundle = 'chado_' . $m;

    $sql = sprintf('SELECT t1.entity_id FROM %s AS t1 INNER JOIN {stock} AS t2 ON t1.record_id = t2.stock_id
      WHERE stock_id = :stock_id LIMIT 1', $chado_bundle);

    $result = chado_query($sql, array(':stock_id' => $stock_id));

    if ($result->rowCount() > 0) {
      $entity_id = $result->fetchField();
    }
  }


  return $entity_id;
}
