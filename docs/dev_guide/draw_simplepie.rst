
Draw a Simple Pie Chart
=========================

1. Load the API into the page you would like your diagram using ``<php tripald3_load_libraries();?>``
2. Retrieve you data and manipulate it into the structure required by the chart. This can be done a number of ways, the easiest of which is to query your database in your Drupal preprocess hook and then save the results as a javascript setting.

.. code-block:: php

  /**
   * Preprocess hook for template my_example.tpl.php
   * The module name is demo.
   */
  function demo_my_example_preprocess(&$variables) {

    // Load the API (Step #1 above)
    tripald3_load_libraries();

    // Retrieve your data.
    $resource = chado_query("SELECT feature_type, num_features FROM {organism_feature_count} WHERE organism_id=:id",
      array(":id" => 1));
    $data = array();
    foreach ($resource as $r) {
      // Save it in the structure required for a simple pie chart.
      $data[] = array(
        "label" => $r->feature_type,
        "count" => $r->num_features,
      );
    }

    // Make it available to javascript via settings.
    $settings = array(
      // Always namespace to your module to avoid collisions.
      'demo' => array(
        // Pass in your data using a descriptive settings key.
        'featureTypePieData' => $data,
      ),
    );
    drupal_add_js($settings, 'setting');
  }

3. Add a container element in your template where you would like the chart drawn.

.. code-block:: html

  <div id="tripald3-simplepie" class="tripald3-diagram">
    <!-- Javascript will add the Simple Pie Chart, Title and Figure legend here -->
  </div>


4. Draw the chart in your template by calling `tripalD3.drawChart()`. This is done within a script tag using Drupal behaviours to ensure it is run at the correct point and the data prepared is passed in.

.. code-block:: html

  <script type="text/javascript">
    Drupal.behaviors.tripalD3demoSimplePie = {
      attach: function (context, settings) {

        // Pull the data out of the javascript settings.
        var data = Drupal.settings.demo.featureTypePieData;

        // Draw your chart.
        tripalD3.drawFigure(
          data,
          {
            "chartType" : "simplepie",
            "elementId": "tripald3-simplepie",
            "height": 250,
            "width": 500,
            "keyPosition": "right",
            "title": "Proportion of <em>Tripalus databasica</em> Feature Types",
            "legend": "The above pie chart depicts the ratio of feature types available for <em>Tripalus databasica</em>.",
          }
        );
      }
    };
  </script>

5. There is no step #5; you're done!
