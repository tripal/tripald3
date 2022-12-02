<?php
/**
 * @file Construct Test Page.
 */

namespace Drupal\my_chart\Controller;

use Drupal\Core\Controller\ControllerBase;

class MyChartSimplePie extends ControllerBase {
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