<?php
/**
 * @file Construct Test Page.
 */

namespace Drupal\tripald3\Controller;

use Drupal\Core\Controller\ControllerBase;

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