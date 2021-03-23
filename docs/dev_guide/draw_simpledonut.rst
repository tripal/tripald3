
Draw a Simple Donut Chart
=========================

.. image:: draw_simpledonut.1.png

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
    // For this example  we're just going to define the array directly.
    $data  = [
      [
        "label": "Accession",
        "count": 2390,
      ],
      [
        "label": "Breeders Cross",
        "count": 567,
      ],
      [
        "label": "Recombinant Inbred Line",
        "count": 115,
      ],
      [
        "label": "Cultivated Variety",
        "count": 78,
      ],
    ];

    // Make it available to javascript via settings.
    $settings = array(
      // Always namespace to your module to avoid collisions.
      'demo' => array(
        // Pass in your data using a descriptive settings key.
        'stockTypeDonutData' => $data,
      ),
    );
    drupal_add_js($settings, 'setting');
  }

3. Add a container element in your template where you would like the chart drawn.

.. code-block:: html

  <div id="tripald3-simpledonut" class="tripald3-diagram">
    <!-- Javascript will add the Simple Donut Chart, Title and Figure legend here -->
  </div>


4. Draw the chart in your template by calling `tripalD3.drawChart()`. This is done within a script tag using Drupal behaviours to ensure it is run at the correct point and the data prepared is passed in.

.. code-block:: html

  <script type="text/javascript">
    Drupal.behaviors.tripalD3demoSimpleDonut = {
      attach: function (context, settings) {

        // Pull the data out of the javascript settings.
        var data = Drupal.settings.demo.stockTypeDonutData;

        // Draw your chart.
        tripalD3.drawFigure(
          data,
          {
            "chartType" : "simpledonut",
            "elementId": "tripald3-simpledonut",
            "height": 250,
            "width": 500,
            "keyPosition": "left",
            "title": "Proportion of <em>Tripalus databasica</em> Germplasm Types",
            "legend": "The above donut chart depicts the ratio of germplasm types available for <em>Tripalus databasica</em>.",
          }
        );
      }
    };
  </script>

5. There is no step #5; you're done!
