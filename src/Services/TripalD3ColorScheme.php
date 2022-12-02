<?php
/**
 * @file 
 * Service - class definition for generating colour schemes used by chart elements.
 * 
 * TripalD3 provides a number of color schemes with configuration for site admin
 * to pick ONE in the general settings and have consistently themed diagrams
 * cross-site for all TripalD3 diagrams.
 */

namespace Drupal\tripald3\Services;

/**
 * Class TripalD3ColorScheme
 */
class TripalD3ColorScheme {
  // Listen for all available modules (enabled) implementing this hook.
  const COLOR_SCHEME_HOOK = 'tripald3_color_schemes';
  
  // Default scheme configuration value.
  private $defaultScheme;
  
  
  public function __construct($config) {
    // Fetch color scheme configurations.
    $default = $config->get('tripald3.settings')->get('tripald3_colorScheme');
    $this->defaultScheme = $default;
  }
  

  /**
   * Retrieve all color schemes from enabled modules (including TripalD3) that
   * implement hook_tripald3_color_scheme.
   */
  public function loadColorSchemes() {
    $schemes = \Drupal::moduleHandler()->invokeAll(static::COLOR_SCHEME_HOOK);
    
    if ($schemes) {
      return $schemes;
    }
    else {
      // No module implementing hook.
      drupal_set_message(t('No color scheme found. Please see documentation on extending color scheme.'), 'warning');
      return FALSE;
    }
  }

  /**
   * Get an ordered color list of a specific type.
   * 
   * @param int $scheme_id
   *   The index number corresponding to a color scheme array value.
   * @param array $scheme
   *   Key values representing a key in a color scheme array.
   * @param string $type
   *   Either quantitative or categorical.
   * 
   * @return array
   *   Color scheme array value that matches the parameters.
   */
  public function getColorScheme($scheme_id, $type, $scheme = []) {
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
        \Drupal::messenger()->addWarning(t('Unable to determine :id TripalD3 color scheme', [':id' => $scheme_id]));
        return FALSE;    
      }  
    }
    else {
      \Drupal::messenger()->addWarning(t('Unknown Tripal D3 color scheme: :id', [':id' => $scheme_id]));  
      return FALSE;
    }
  }

  /**
   * Register color schemes to TripalD3 chart script library.
   * 
   * @return array
   *   Selected color scheme and default scheme key.
   */
  public function registerColorScheme() {
    $default = $this->defaultScheme;

    $jsSettings = ['tripalD3' => []];
    $schemes = $this->loadColorSchemes();

    if ($schemes) {
      foreach ($schemes as $id => $scheme) {
        $jsSettings['tripalD3']['colorSchemes'][$id]['name'] = $scheme['name'];
        $jsSettings['tripalD3']['colorSchemes'][$id]['quantitative'] = $this->getColorScheme($id, 'quantitative', $scheme);
        $jsSettings['tripalD3']['colorSchemes'][$id]['categorical']  = $this->getColorScheme($id, 'categorical', $scheme);
      }
    }

    // Add in the currently selected/default scheme.
    $jsSettings['tripalD3']['colorSchemes']['selected'] = $default;
    
    return $jsSettings;
  }
}