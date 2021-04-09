<?php
/**
 * @file Construct Test Page.
 */

namespace Drupal\my_chart\Controller;

use Drupal\Core\Controller\ControllerBase;

class MyChartSimplePie extends ControllerBase {
  public function content() {
    // Fetch configuration settings - autoresize, colour scheme and pedigree terms.
    // Configuration values will be available in scripts as drupalSettings.
    $config = \Drupal::service('config.factory')
      ->getEditable('tripald3.settings');
    
    // Namespace module name to prevent name collision.
    
    // Colour schemes.
    $default_scheme = $config->get('tripald3_colorScheme');
    $to_Drupalsettings['tripalD3']['vars']['scheme'] = tripald3_register_colorschemes($default_scheme);

    // Auto resize configuration.        
    $default_resize = $config->get('tripald3_autoResize');
    $to_Drupalsettings['tripalD3']['vars']['autoResize'] = $default_resize;
    
    // Data.
    $data  = [
      [
        'label' => 'Accession',
        'count' => 2390,
      ],
      [
        'label' => 'Breeders Cross',
        'count' => 567,
      ],
      [
        'label' => 'Recombinant Inbred Line',
        'count' => 115,
      ],
      [
        'label' => 'Cultivated Variety',
        'count' => 78,
      ],
    ];

    // drupalSettings.stockTypePieData.
    $to_Drupalsettings['tripalD3']['vars']['simplePieData'] = json_encode($data);

    $libraries = [
      // CORE
      // D3, Tripal D3 and Test Script
      'tripald3/D3',
      'tripald3/tripalD3',
      
      // CHARTS
      // Pie
      'tripald3/lib-pie',

      'my_chart/mychart-simplepie',

      'tripald3/style-tripald3'
    ];

    return [
      '#theme' => 'mychart_theme_simplepie',
      '#attached' => [
        'library' => $libraries,
        'drupalSettings' => $to_Drupalsettings
      ] 
    ];  
  }    
}