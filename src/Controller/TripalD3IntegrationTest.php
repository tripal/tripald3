<?php
namespace Drupal\tripald3\Controller;

use Drupal\Core\Controller\ControllerBase;

// Include colour scheme api of this module.
// @see /api
module_load_include('inc', 'tripald3', 'api/color_scheme');

/**
 * Defines TripalD3IntegrationDemo class.
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
      'tripald3/libd3',
      'tripald3/tripalD3',
      'tripald3/libtest',
      
      // CHARTS
      // Pie
      'tripald3/lib-pie',
      'tripald3/lib-bar',
      'tripald3/lib-pedigree',
      
      // CREATE
      'tripald3/create-test',
      
      // STYLE
      'tripald3/libdemostyle'
    ];

    return [
      '#theme' => 'tripald3test',

      '#attached' => [
        'library' => $libraries,
        'drupalSettings' => $to_Drupalsettings
      ] 
    ];  
  }    
}