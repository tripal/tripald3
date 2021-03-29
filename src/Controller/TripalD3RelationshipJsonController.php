<?php
/**
 * @file Generate datapoints required to generate pedigree tree. 
 * Response is a JSON object.
 */

// Note From 7.x.1.x 
// On code revamping, Tripal D3 loosely integrate the pedigree methods below
// without fully expanding the codebase. More work is needed to address
// performance issue and concerns relating to data retrival and ideally
// the data structure to be more generic to handle more than just
// stock-based trees. Related JS library underwent revamp.
//
// @see: api/pedigree.inc

namespace Drupal\tripald3\Controller;

use Symfony\Component\HttpFoundation\Response;

// Include pedigree api of this module.
// @see /api
module_load_include('inc', 'tripald3', 'api/pedigree');

/**
 * Defines TripalD3RelationshipController class.
 */
class TripalD3RelationshipJsonController {
  // Repare JSON respose.
  public function response($base_table, $id) {
    $json_response = new Response();
    $json_response->headers->set('method', 'GET');
    $json_response->headers->set('Content-Type', 'application/json');
    $json_response->headers->set('Access-Control-Allow-Origin', '*');
    
    // From pedigree API.
    $subset = tripald3_get_pedigree_relationship_types();
    $tree_data = $this->getRelationshipTree($base_table, $id, $subset);
    
    if ($tree_data) {
      // Has value returned.
      $status = 200;
      $data = json_encode($tree_data);
    }
    else {
      // Empty result.
      $status = 500;
      $data = [];
    }

    $json_response->headers->set('status', $status);
    $json_response->setContent($data);

    return $json_response;
  }
  
  // NOTE: methods below is the equivalent of the library 
  //       in includes/stock_pedigree.inc in v7.

  /**
   * Prepare relationships datapoints.
   * Recursive Function to navigate relationship data stored in chado and return
   * it as a nested parent => child array.
   * 
   * ASSUMPTION #1: In pedigree tree's the root is the child
   * without any children of it's own.
   * 
   * @param $base_table string
   *   Base table, a chado table.
   * @param $id int
   *   An id number, presumed to exist in the base table.
   * @param $options array
   *   Additional options applied to the query.
   * @param $data array
   *   Data to use instead of data as a result of query.
   * 
   * @return array
   *   Array, parent - child relationships. 
   */
  public function getRelationshipTree($base_table, $id, $options = [], $data = []) {
    // Bio data resource alias.
    $bio_data = '/bio_data/';
    // URL.
    // host/bio_data/entity_id.
    $url = '%s%s%d';

    $rel_table = $base_table . '_relationship';
    $base_table_pkey = $base_table . '_id';

    $generate_var_options = [
      'include_fk' => []
    ];

    // ROOT:
    // Get the root details if none were provided.
    $is_root = FALSE;

    if (empty($data)) {
      $is_root = TRUE;

      $root = chado_generate_var($base_table, [$base_table_pkey => $id], $generate_var_options);
      $root = chado_expand_var($root, 'node', 'stock');
      
      // Link of the root.
      $entity_id = $this->getPedigreeEntityId($root->stock->stock_id, $root->stock->type_id);      
      $root->url = ($entity_id == '#') 
        ? $entity_id : sprintf($url, $GLOBALS['base_url'], $bio_data, $entity_id);
    
      // In some cases root->name returns the name of the person who entered the germplasm. 
      // This condition will check if stock is present if so, use it instead of current.
      $data = [
        'current' => ($root->stock) ? $root->stock : $root,
        'parent'   => ['stock_id' => "null", 'name' => "null"],
        'children'  => [],
      ];

      $data['current']->nid = $root->nid;
    }

    // CHILDREN:
    // Base Case: there are no additional relationships.
    if (!isset($data['children'])) {
      $data['children'] = [];
    }

    // Retrieve relationships where the passed in record is the object.
    $sql = '
      SELECT r.subject_id, r.type_id, cvt.name as type, r.object_id
      FROM {' . $rel_table . '} r LEFT JOIN {cvterm} cvt ON cvt.cvterm_id=r.type_id
      WHERE ';

    if (isset($options['restrict relationships'])) {
      $where = [];
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
    $rels = chado_query($sql , [':id' => $id]);

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

      $child = chado_generate_var($base_table, ['stock_id' => $object], $generate_var_options);
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
      $entity_id = $this->getPedigreeEntityId($stock_id, $type_id);
      $stock->stock->url = $stock->url = ($entity_id == '#')
        ? $entity_id
        : sprintf($url, $GLOBALS['base_url'], $bio_data, $entity_id);

      $subnode = [
        'current' => $stock,
        'parent' => [
          'parent_id' => $subject,
          'name' => $data['current']->name,
        ],
        'relationship' => $rel,
        'children' => []
      ];

      $subnode['relationship']->subject = $stock->name;
      $subnode['relationship']->object = $data['current']->name;

      // Now recursively add children.
      // NOTE: since we support folloing relationships from both directions
      // we need to be careful how we which id we recursively follow to ensure
      // we don't end up in an endless loop.
      $data['children'][] = $this->getRelationshipTree($base_table, $object, $options, $subnode);
    }

    // D3 assumes the first level will be an array of roots,
    // so we need to make that happen if we're at the root.
    if ($is_root) {
      $data = [ $data ];
    }

    return $data;      
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
  public function getPedigreeEntityId($stock_id, $type_id) {
    // This character is also used to tell JS if node should be rendered as link or a text.
    $entity_id = '#';

    $has_tbl = chado_query("SELECT 1 FROM pg_tables WHERE tablename = 'tripal_bundle'")
      ->fetchField();  
 
    if ($has_tbl === 1) {  
      $database = \Drupal::database();
      $query = $database->query('SELECT t2.name
        FROM {tripal_term} AS t1 INNER JOIN {tripal_bundle} AS t2 ON t1.id = t2.term_id
        WHERE t1.accession = (
          SELECT t3.accession
          FROM chado.dbxref AS t3 INNER JOIN chado.cvterm AS t4 USING(dbxref_id)
          WHERE t4.cvterm_id = :stock_type)', array(':stock_type' => $type_id));
      
      $m = $query->fetchField();

      if ($m) {
        $chado_bundle = 'chado_' . $m;

        $sql = sprintf('SELECT t1.entity_id FROM %s AS t1 INNER JOIN {stock} AS t2 ON t1.record_id = t2.stock_id
        WHERE stock_id = :stock_id LIMIT 1', $chado_bundle);

        $result = chado_query($sql, array(':stock_id' => $stock_id));

        if ($result->rowCount() > 0) {
          $entity_id = $result->fetchField();
        }
      }
    }

    return $entity_id;
  }
}