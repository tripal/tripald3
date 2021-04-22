<?php
/**
 * @file Construct Test Page.
 */

namespace Drupal\my_chart\Controller;

use Drupal\Core\Controller\ControllerBase;

class MyChartMultiseriesDonut extends ControllerBase {
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
    $data = [
      [
        "label" => "MarkerA",
        "parts" => [
          [
            "label" => "GG",
            "count" => 16,
          ],
          [
            "label" => "AA",
            "count" => 10,
          ],
          [
            "label" => "AG",
            "count" => 2,
          ],
        ],
      ],
      [
        "label" => "MarkerB",
        "parts" => [
          [
            "label" => "GG",
            "count" => 145,
          ],
          [
            "label" => "AA",
            "count" => 99,
          ],
          [
            "label" => "AG",
            "count" => 19,
          ],
        ],
      ],
      [
        "label" => "MarkerC",
        "parts" => [
          [
            "label" => "GG",
            "count" => 78,
          ],
          [
            "label" => "AA",
            "count" => 73,
          ],
        ],
      ],
    ];

    // drupalSettings.stockTypePieData.
    $to_Drupalsettings['tripalD3']['vars']['multiseriesDonutData'] = json_encode($data);

    $libraries = [
      // CORE
      // D3, Tripal D3 and Test Script
      'tripald3/D3',
      'tripald3/tripalD3',
      
      // CHARTS
      // Pie
      'tripald3/lib-pie',

      'my_chart/mychart-multiseriesdonut',

      'tripald3/style-tripald3'
    ];

    return [
      '#theme' => 'mychart_theme_multiseriesdonut',
      '#attached' => [
        'library' => $libraries,
        'drupalSettings' => $to_Drupalsettings
      ] 
    ];  
  }    
}