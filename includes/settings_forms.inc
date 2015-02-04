<?php
/**
 * @file
 * Settings forms for this module. Found at admin/tripal/extension/tripald3.
 */

/**
 * Settings general to Tripal D3 diagrams such as shared colors, etc.
 */
function tripald3_common_settings_form($form, $form_state) {

  tripald3_register_colorschemes();
  $form['#attached']['js'][] = 'http://d3js.org/d3.v3.js';
  $form['#attached']['js'][] = drupal_get_path('module', 'tripald3') . '/js/bioD3.js';
  $form['#attached']['js'][] = drupal_get_path('module', 'tripald3') . '/js/colorscheme_display.js';

  $form['colors'] = array(
    '#type' => 'fieldset',
    '#title' => 'Color Schemes',
    '#description' => 'Select the color scheme below that goes best with the theme of your site. The color scheme chosen will be used for all Tripal D3 Diagrams site-wide providing a nice consistent interface.',
  );

  $schemes = tripald3_get_color_schemes();
  $options = array();
  foreach ($schemes as $id => $scheme) {
    $options[$id] = $scheme['name'] . '<div id="TD3-scheme" class="' . $id . '"></div>';
  }
  $form['colors']['color_scheme'] = array(
    '#type' => 'radios',
    '#options' => $options,
    '#default_value' => variable_get('tripald3_colorScheme', 'BlOr')
  );

  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => 'Save Configuration'
  );

  return $form;
}

/**
 * Implements hook_form_validate().
 * @see tripald3_common_settings_form().
 */
function tripald3_common_settings_form_validate($form, $form_state) {}

/**
 * Implements hook_form_submit().
 * @see tripald3_common_settings_form().
 */
function tripald3_common_settings_form_submit($form, $form_state) {

  variable_set('tripald3_colorScheme', $form_state['values']['color_scheme']);
}

/**
 * Settings specific to the stock pedigree pane
 */
function tripald3_stock_pedigree_settings_form($form, &$form_state) {

  $form['#attached']['css'][] = drupal_get_path('module', 'tripald3') . '/css/tripald3.css';
  $form['#attached']['css'][] = array(
    'type' => 'inline',
    'data' => 'select.form-select {width: 350px; }'
  );

  $form['#attached']['js'][] = 'http://d3js.org/d3.v3.js';
  $form['#attached']['js'][] = drupal_get_path('module', 'tripald3') . '/js/relsetting_diagrams.js';

  // Used to allow admin to choose colors per relationship.
  // Most used relationships first.
  $color_rels = array();
  // Used to allow admin to choose which relationships to follow.
  // Sorted alphabetically.
  $rel_options = array();

  // Get relationships for the settings form.
  $sql = "SELECT sr.type_id, cvt.name as type_name
          FROM {stock_relationship} sr
          LEFT JOIN {cvterm} cvt ON cvt.cvterm_id=sr.type_id
          GROUP BY sr.type_id, cvt.name
          ORDER BY count(sr.*) desc";
  $rels = chado_query($sql);
  foreach ($rels as $r) {
    $color_rels[$r->type_id] = $r->type_name;
    $rel_options[$r->type_id] = $r->type_name;
  }
  asort($rel_options);
  $form_state['relationships'] = $rel_options;

  $default_rels = variable_get('tripald3_stock_pedigree_rels', NULL);
  if (!$default_rels) {
    $default_rels = array(
      'object' => array(),
      'subject' => $rel_options
    );
  }
  else {
    $default_rels = unserialize($default_rels);
  }

  $form['rels'] = array(
    '#type' => 'fieldset',
    '#title' => 'Relationships',
    '#description' => "To ensure that pedigrees display correctly, you need to
      configure this module to use your vocabulary correctly. Specifically,
      <ol>
        <li>Ensure that you've choosen all the relationships needed to get from
          your child stock/germplasm to it's parents.</li>
        <li>Ensure that relationships will be followed in the right direction.
          Since relationships are bi-directional in Tripal/Chado you need to
          configure which relationships have the parent as the subject and
          which have the parent as the object.</li>
      </ol>
      <em><strong>NOTE:</strong> Each relationship can only be followed in ONE
        direction.</em>"
  );

  $form['rels']['object'] = array(
    '#type' => 'fieldset',
    '#title' => 'Subject is Parent',
    '#prefix' => '<span style="float: left; width: 45%; margin-right: 2%;">',
    '#suffix' => '</span>',
    '#description' => '<span class="rel-settings-diagram tree subject"></span>
          <span class="rel-settings-diagram sentence subject"></span>
          <br /><br />Select the relationships below where the parent-side of the relationship is the subject. This will put the subject higher in the tree than the object, as shown in the digram above.',
  );

  $form['rels']['object']['object_rels'] = array(
    '#type' => 'select',
    '#title' => 'Relationships to include',
    '#options' => $rel_options,
    '#multiple' => TRUE,
    '#default_value' => array_keys($default_rels['object']),
  );

  $form['rels']['subject'] = array(
    '#type' => 'fieldset',
    '#title' => 'Object is Parent',
    '#prefix' => '<span style="float: left; width: 45%; margin-right: 2%;">',
    '#suffix' => '</span>',
    '#description' => '<span class="rel-settings-diagram tree object"></span>
          <span class="rel-settings-diagram sentence object"></span>
          <br /><br />Select the relationships below where the parent-side of the relationship is the object. This will put the object higher in the tree than the subject, as shown in the digram above.',
  );

  $form['rels']['subject']['subject_rels'] = array(
    '#type' => 'select',
    '#title' => 'Relationships to include',
    '#options' => $rel_options,
    '#multiple' => TRUE,
    '#default_value' => array_keys($default_rels['subject']),
  );
/**
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

  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => 'Save Configuration'
  );

  return $form;
}

/**
 * Implements hook_form_validate().
 * @see tripald3_stock_pedigree_settings_form().
 */
function tripald3_stock_pedigree_settings_form_validate($form, $form_state) {

  // Check that no relationship exists in both subject & object lists.
  // Trying to avoid users configuring endless loops :)
  $common = array_intersect($form_state['values']['subject_rels'], $form_state['values']['object_rels']);
  if (!empty($common)) {

    // Make a more useful error message
    $common_rels = array();
    foreach ($common as $id) {
      $common_rels[] = $form_state['relationships'][$id];
    }

    // Provide error message.
    form_set_error('subject_rels', 'Each relationship can only be followed in ONE direction (ie: be selected in one of the "Relationships to include" lists)');
    form_set_error('object_rels', 'Relationships selected in both lists include: <em>' . implode(', ', $common_rels) . '</em>.');
  }
}

/**
 * Implements hook_form_submit().
 * @see tripald3_stock_pedigree_settings_form().
 */
function tripald3_stock_pedigree_settings_form_submit($form, $form_state) {

  $object_rels = array_intersect_key($form_state['relationships'], $form_state['values']['object_rels']);
  $subject_rels = array_intersect_key($form_state['relationships'], $form_state['values']['subject_rels']);

  $rels = array(
    'object' => $object_rels,
    'subject' => $subject_rels
  );
  variable_set('tripald3_stock_pedigree_rels', serialize($rels));

}