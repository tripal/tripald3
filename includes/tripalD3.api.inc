<?php
/**
 * @file
 * Contains API functions related to Tripal D3.js integration.
 */

/**
 * Load JS/CSS Needed to draw a Tripal D3 Figure.
 */
function tripald3_load_libraries() {

  // D3.js
  $library = libraries_load('d3');
  // If the library didn't load then provide an error to the admin.
  if (empty($library['loaded'])) {
    drupal_set_message('Unable to load D3.js. Please make sure you have downloaded D3.js and placed it in your libraries directory.', 'error');
    if (isset($library['error message'])) {
      drupal_set_message($library['error message'], 'error');
    }
  }

  // TripalD3.js
  $path = drupal_get_path('module','tripald3');
  drupal_add_js($path . '/js/tripalD3.js', array( 'weight' => -9 ));
  drupal_add_js($path . '/js/tripalD3.test.js', array( 'weight' => -8 ));
  drupal_add_js($path . '/js/tripalD3.pie.js', array( 'weight' => -7 ));
  drupal_add_js($path . '/js/tripalD3.bar.js', array( 'weight' => -7 ));
  /** @pedigree removing pedigree until data format is simplified. */
  drupal_add_js($path . '/js/tripalD3.pedigree.js', array( 'weight' => -7 ));
  drupal_add_js($path . '/js/tripalD3.histo.js', array( 'weight' => -7 ));
  drupal_add_js($path . '/js/tripalD3.simpleHisto.js', array( 'weight' => -7));
  // CSS.
  drupal_add_css($path . '/css/tripald3.css', array('group' => CSS_DEFAULT, 'type' => 'file'));

  // Settings.
  tripald3_register_colorschemes();
  $jsSettings['tripalD3']['autoResize'] = variable_get('tripald3_autoResize', FALSE);
  drupal_add_js($jsSettings, 'setting');

}
