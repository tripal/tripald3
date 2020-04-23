<?php

/**
 * @file
 * TripalD3 provides a number of color schemes with configuration for site admin
 * to pick ONE in the general settings and have consistently themed diagrams
 * cross-site for all TripalD3 diagrams.
 */

/**
 * Implements hook_tripald3_color_schemes().
 */
function tripald3_tripald3_color_schemes() {
  $color_schemes = array();

  $color_schemes['PrpGr'] = array(
    'name' => 'Purple-Green',
    'colors' => array('#3d4051', '#753fb0', '#8f7abf', '#294090', '#6683c3', '#0C6758', '#7AB318', '#A0C55E', '#9fa7a3'),
    'pick order' => array(
      'quantitative' => array(0, 1, 2, 3, 4, 5, 6, 7, 8),
      'categorical' => array(3, 6, 1, 4, 5, 8, 2, 7, 0)
    ),
  );

  $color_schemes['BlOr'] = array(
    'name' => 'Blue-Orange',
    'colors' => array('#004854', '#295990', '#6696c3', '#017E80', '#00B9BC', '#F10A12', '#FF8600', '#FFB200', '#EDE1BB'),
    'pick order' => array(
      'quantitative' => array(0, 1, 2, 3, 4, 5, 6, 7, 8),
      'categorical' => array(3,6,4,5,1,7,8,2,0)
    ),
  );

  $color_schemes['RedYl'] = array(
    'name' => 'Fire',
    'colors' => array('#670927', '#6d3f24', '#a74811', '#C1002C', '#F10A12', '#FF8600', '#FFB200', '#CFD6B4', '#EDE1BB'),
    'pick order' => array(
      'quantitative' => array(0, 1, 2, 3, 4, 5, 6, 7, 8),
      'categorical' => array(3,6,2,5,8,4,1,7,0)
    ),
  );

  $color_schemes['BrnGr'] = array(
    'name' => 'Earth Green',
    'colors' => array('#323c30', '#665343', '#AD9575', '#68722d', '#a3bd00', '#ceca72', '#A9B79E', '#CFD6B4', '#F1E7CD'),
    'pick order' => array(
      'quantitative' => array(0, 1, 2, 3, 4, 5, 6, 7, 8),
      'categorical' => array(3,7,1,4,2,7,1,8,0)
    ),
  );

  $color_schemes['pRdBl'] = array(
    'name' => 'Earth Rose',
    'colors' => array('#670927', '#665343', '#AD9575', '#9D1D36', '#C25848', '#DAA887', '#A9B79E', '#CFD6B4', '#E8DDBD'),
    'pick order' => array(
      'quantitative' => array(0, 1, 2, 3, 4, 5, 6, 7, 8),
      'categorical' => array(3,7,1,4,2,7,1,8,0)
    ),
  );

  $color_schemes['NvGr'] = array(
    'name' => 'Navy-Green',
    'colors' => array('#090C0E', '#253443', '#21597D', '#0C6758', '#7AB318', '#A0C55E', '#9fa7a3', '#BBC7BD', '#D5D4E6'),
    'pick order' => array(
      'quantitative' => array(0, 1, 2, 3, 4, 5, 6, 7, 8),
      'categorical' => array(4,3,1,7,2,5,8,6,0)
    ),
  );
  
  $color_schemes['AllBlu'] = array(
    'name' => 'All-Blues',
    'colors' => array('#163854', '#1b4569', '#21537d', '#266091', '#2b6da5', '#317bb9', '#3988cb', '#4d94d0', '#76acbd'),
    'pick order' => array(
      'quantitative' => array(0, 1, 2, 3, 4, 5, 6, 7, 8),
      'categorical' => array(4,3,1,7,2,5,8,6,0)
    ),
  );

  return $color_schemes;
}

/**
 * Retrieve a list of available color schemes.
 */
function tripald3_get_color_schemes() {

  $schemes = module_invoke_all('tripald3_color_schemes');
  return $schemes;

}

/**
 * Get an ordered color list of a specific type
 */
function tripald3_get_scheme_colors($scheme_id, $type, $scheme = array()) {

  if (!empty($scheme)) {
    if (isset($scheme['colors']) AND isset($scheme['pick order'][$type])) {

      $colors = array();
      foreach ($scheme['pick order'][$type] as $index) {
        if (isset($scheme['colors'][$index])) {
          $colors[] = $scheme['colors'][$index];
        }
      }
      return $colors;
    }
    else {
      drupal_set_message(t('Unable to determine :id TripalD3 color scheme', array(':id' => $scheme_id)), 'warning');
      return false;
    }
  }
  else {
    drupal_set_message(t('Unknown Tripal D3 color scheme: :id', array(':id' => $scheme_id)), 'warning');
    return false;
  }
}

/**
 * Register Color Schemes with Javascript
 */
function tripald3_register_colorschemes() {

  $jsSettings = array('tripalD3' => array());

  $schemes = tripald3_get_color_schemes();
  foreach ($schemes as $id => $scheme) {

    $jsSettings['tripalD3']['colorSchemes'][$id]['name'] = $scheme['name'];
    $jsSettings['tripalD3']['colorSchemes'][$id]['quantitative'] = tripald3_get_scheme_colors($id, 'quantitative', $scheme);
    $jsSettings['tripalD3']['colorSchemes'][$id]['categorical'] = tripald3_get_scheme_colors($id, 'categorical', $scheme);
  }

  // Add in the currently selected scheme.
  $jsSettings['tripalD3']['colorSchemes']['selected'] = variable_get('tripald3_colorScheme', 'BlOr');
  drupal_add_js($jsSettings, 'setting');

  return $jsSettings;
}
