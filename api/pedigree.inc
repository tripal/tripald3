<?php
/**
 * @file
 * Tripal D3 chado databse API
 * @see important note in Controller/TripalD3RelationshipJsonController.
 */

 /**
  * Fetch relationship from congiuration variable.
  */
function tripald3_get_stockrelationship() {
  // Used to allow admin to choose which relationships to follow.
  // Sorted alphabetically.
  $rel_options = array();

  // Get relationships for the settings form.
  $sql = "
    SELECT sr.type_id, cvt.name as type_name
    FROM {stock_relationship} sr
    LEFT JOIN {cvterm} cvt ON cvt.cvterm_id=sr.type_id
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


// @TODO:
// @pedigree Comment out pedigree's until re-vamped.

/*
  $form['colors'] = array(
    '#type' => 'fieldset',
    '#title' => 'Relationship Color',
    '#description' => 'Pedigrees developed by this module color-code the
      relationship connecting two nodes in order to ease identification of these
      relationships. To ensure you have the best color set for the relationships
      used most often in your particular data, please choose the colors you want
      used for each relationship.'
  );

  $relationship_types = chado_query(
    'SELECT r.type_id as type_id, cvt.name as type_name, count(r.*) as num_used
    FROM {stock_relationship} r
    LEFT JOIN {cvterm} cvt ON cvt.cvterm_id=r.type_id
    GROUP BY r.type_id, cvt.name
    ORDER BY count(r.*) DESC', array()
  );

  foreach($relationship_types as $reltype) {

    $form['colors'][$reltype->type_id]['label'] = array(
      '#type' => 'item',
      '#markup' => 'Relationship Type: <strong>' . $reltype->type_name . '</strong>',
      '#description' => 'Select the color & line-style for <em>' . $reltype->type_name . '</em> relationship lines.'
    );

    $form['colors'][$reltype->type_id]['color'] = array(
      '#type' => 'select',
      '#title' => 'Color',
      '#options' => array()
    );

    $form['colors'][$reltype->type_id]['line_style'] = array(
      '#type' => 'select',
      '#title' => 'Line Style',
      '#options' => array()
    );
  }
*/
