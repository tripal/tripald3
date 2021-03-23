<?php
/**
 * @file Construct Test Page.
 */

namespace Drupal\tripald3\Controller;

use Drupal\Core\Controller\ControllerBase;

// Include colour scheme api of this module.
// @see /api
module_load_include('inc', 'tripald3', 'api/color_scheme');

/**
 * Defines TripalD3IntegrationTest class.
 * This will render the page found in configuration/test.
 * The page is using a template page in /templages directory.
 * @see tripald3.module for theme definition.
 */
class TripalD3IntegrationTest extends ControllerBase {
  /**
   * Returns a render-able array for Demo page.
   */
  public function content() {
    // Fetch configuration settings - autoresize, colour scheme and pedigree terms.
    // Configuration values will be available in scripts as drupalSettings.
    $config = \Drupal::service('config.factory')
      ->getEditable('tripald3.settings');
    
    // Array to hold all configurations values returned.
    $to_Drupalsettings = [];

    // Colour schemes.
    // This value will be accessible to script using:
    // drupalSettings.scheme
    $default_scheme = $config->get('tripald3_colorScheme');
    $to_Drupalsettings['scheme'] = tripald3_register_colorschemes($default_scheme);

    // Auto resize configuration.        
    // This value will be accessible to script using:
    // drupalSettings.autoresize.tripalD3.autResize.
    $default_resize = $config->get('tripald3_autoResize');
    $to_Drupalsettings['autoresize']['tripalD3']['autoResize'] = $default_resize;
    
    // @see libraries.yml
    $libraries = [
      // CORE
      // Include core libries.
      'tripald3/D3',
      'tripald3/tripalD3',

      // CHARTS
      // Include chart API libraries.
      'tripald3/lib-pie',
      'tripald3/lib-bar',
      'tripald3/lib-pedigree',
      
      // CONSTRUCT
      'tripald3/page-test',
      'tripald3/create-test',

      // STYLE
      'tripald3/style-tripald3'
    ];

    return [
      '#theme' => 'theme_tripald3test',
      '#attached' => [
        'library' => $libraries,
        'drupalSettings' => $to_Drupalsettings
      ] 
    ];  
  }    
}