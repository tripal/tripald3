<?php
/**
 * @file 
 * Service - class definition for pedigree diagram integration. 
 */

namespace Drupal\tripald3\Services;

/**
 * Class TripalD3Pedigree
 */
class TripalD3Pedigree {
  // Default scheme configuration value.
  private $defaultRelationshipTypes;
  
  
  public function __construct($config) {
    // Fetch color scheme configurations.
    $default = $config->get('tripald3.settings')->get('tripald3_stock_pedigree_rels');
    $this->$defaultRelationshipTypes = $default;
  }
  

  /**
   * Chado database fetch all stock relationships available.
   * Used to allow admin to choose which relationships to follow.
   * 
   * @return array
   *   An array (type_id, cvterm name) of terms from stock_relationship table
   *   each representing a relationship type.
   */
  public function getStockRelationshipTypes() {
    $rel_options = [];

    // Get relationships for the settings form.
    $sql = "
      SELECT sr.type_id, cvt.name as type_name
      FROM {stock_relationship} sr LEFT JOIN {cvterm} cvt ON cvt.cvterm_id=sr.type_id
      GROUP BY sr.type_id, cvt.name
      ORDER BY count(sr.*) desc
    ";
    
    $rels = chado_query($sql);
    foreach ($rels as $r) {
      $rel_options[ $r->type_id ] = $r->type_name;
    }
    
    asort($rel_options);
    return $rel_options;
  }

  /**
   * API: check if this node would consist of a single level tree with no leaves.
   *
   * @param $stock_id
   *   The unique identifier of the root stock/germplasm.
   * @return
   *   TRUE if there are no approved relationships attached to the root node
   *   and FALSE otherwise.
   */
  public function isNodeLeaflessTree($stock_id) {
    $relationship_types = tripald3_get_pedigree_relationship_types();

    // Check relationships where the root is the subject.
    $subject_rels = 0;

    if (!empty($relationship_types['subject'])) {
      $vars = [':stock_id' => $stock_id];
      $rel_placeholders = [];
      
      foreach ($relationship_types['subject'] as $k => $type_name) {
        $vars[':reltype' . $k] = $type_name;
        $rel_placeholders[] = ':reltype' . $k;
      }
      
      $sql = '
        SELECT count(*) as num_relationships
        FROM {stock_relationship} sr LEFT JOIN {cvterm} cvt ON sr.type_id=cvt.cvterm_id
        WHERE subject_id=:stock_id AND cvt.name IN (' . implode(',', $rel_placeholders) . ')
      ';
      $subject_rels = chado_query($sql, $vars)->fetchField();
    }

    // Check relationships where the root is the object.
    $object_rels = 0;

    if (!empty($relationship_types['object'])) {
      $vars = array(':stock_id' => $stock_id);
      $rel_placeholders = [];
      
      foreach ($relationship_types['object'] as $k => $type_name) {
        $vars[':reltype' . $k] = $type_name;
        $rel_placeholders[] = ':reltype' . $k;
      }
      
      $sql = '
        SELECT count(*) as num_relationships
        FROM {stock_relationship} sr LEFT JOIN {cvterm} cvt ON sr.type_id=cvt.cvterm_id
        WHERE object_id=:stock_id AND cvt.name IN (' . implode(',', $rel_placeholders) . ')
      ';
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
   * Restrict datapoints to this subset only.
   */
  public function getPedigreeRelationshipTypes() {
    $rels_to_restrict = $this->$defaultRelationshipTypes;

    if (!$rels_to_restrict) {
      // Get relationships used in stock table.
      $rels = array();
      $sql = '
        SELECT sr.type_id, cvt.name as type_name
        FROM {stock_relationship} sr LEFT JOIN {cvterm} cvt ON cvt.cvterm_id=sr.type_id
        GROUP BY sr.type_id, cvt.name
        ORDER BY count(sr.*) desc
      ';

      $rel_query = chado_query($sql);
      foreach ($rel_query as $r) {
        $rels[$r->type_id] = $r->type_name;
      }

      $rels_to_restrict = array(
        'object' => [],
        'subject' => $rels
      );
    }
    else {
      $rels_to_restrict = unserialize($rels_to_restrict);
    }

    return $rels_to_restrict;
  }
}