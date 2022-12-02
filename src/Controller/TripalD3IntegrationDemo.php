<?php
/**
 * @file Construct Demo Page.
 */

namespace Drupal\tripald3\Controller;

use Drupal\Core\Controller\ControllerBase;

/**
 * Defines TripalD3IntegrationDemo class.
 */
class TripalD3IntegrationDemo extends ControllerBase {
  /**
   * Returns a render-able array for Demo page.
   */
  public function content() {
    // Make configuration values available to Javascript libraries.  
    
    // Color scheme configuration.
    $default_scheme = \Drupal::service('tripald3.TripalD3ColorScheme')
      ->registerColorScheme();
    $to_Drupalsettings['tripalD3']['vars']['colorScheme'] = $default_scheme; 

    // Auto resize configuration.        
    $default_resize = $this->config('tripald3.settings')
      ->get('tripald3_autoResize');
    $to_Drupalsettings['tripalD3']['vars']['autoResize']  = $default_resize;
    
    
    // @see libraries.yml
    $libraries = [
      // CORE
      // D3, Tripal D3 and Test Script
      'tripald3/D3',
      'tripald3/tripalD3',
      
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