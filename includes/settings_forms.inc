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
function tripald3_stock_pedigree_settings_form($form, $form_state) {

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
  return $form;
}

/**
 * Implements hook_form_validate().
 * @see tripald3_stock_pedigree_settings_form().
 */
function tripald3_stock_pedigree_settings_form_validate($form, $form_state) {}

/**
 * Implements hook_form_submit().
 * @see tripald3_stock_pedigree_settings_form().
 */
function tripald3_stock_pedigree_settings_form_submit($form, $form_state) {}