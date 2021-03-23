<?php
/**
 * @file Construct Demo Page.
 */

namespace Drupal\tripald3\Controller;

use Drupal\Core\Controller\ControllerBase;

// Include colour scheme api of this module.
// @see /api
module_load_include('inc', 'tripald3', 'api/color_scheme');

/**
 * Defines TripalD3IntegrationDemo class.
 */
class TripalD3IntegrationDemo extends ControllerBase {
  /**
   * Returns a render-able array for Demo page.
   */
  public function content() {
    // Fetch configuration settings - autoresize, colour scheme and pedigree terms.
    // Configuration values will be available in scripts as drupalSettings.
    $config = \Drupal::service('config.factory')
      ->getEditable('tripald3.settings');
    
    $to_Drupalsettings = [];

    // Colour schemes.
    $default_scheme = $config->get('tripald3_colorScheme');
    $to_Drupalsettings['scheme'] = tripald3_register_colorschemes($default_scheme);

    // Auto resize configuration.        
    $default_resize = $config->get('tripald3_autoResize');
    $to_Drupalsettings['autoresize']['tripalD3']['autoResize'] = $default_resize;
    
    // @see libraries.yml
    $libraries = [
      // CORE
      // D3, Tripal D3 and Test Script
      'tripald3/D3',
      'tripald3/tripalD3',
      'tripald3/create-test',
      
      // CHARTS
      // Pie
      'tripald3/lib-pie',
      'tripald3/lib-bar',
      'tripald3/lib-pedigree',
      
      // CREATE
      'tripald3/create-multidonut',
      'tripald3/create-pie',
      'tripald3/create-multiseriesdonut',
      'tripald3/create-bar',
      'tripald3/create-pedigree',
      
      // STYLE
      'tripald3/style-tripald3'
    ];

    return [
      '#theme' => 'theme_tripald3demo',
      '#attached' => [
        'library' => $libraries,
        'drupalSettings' => $to_Drupalsettings
      ]      
    ];  
  }    
}