Draw a Simple Line Plot
===========================

..image:: draw_simplelineplot1.png

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
    $linePlotData= [
	      {x: 10, y: 20}, 
	      {x: 30, y: 40}, 
	      {x: 50, y: 60}, 
	      {x: 70, y: 80}, 
	      {x: 90, y: 100}
      ];

    //test

    // Make it available to javascript via settings.
    $settings = array(
      // Always namespace to your module to avoid collisions.
      'demo' => array(
        // Pass in your data using a descriptive settings key.
        'stockTypeLinePlotData' => $linePlotData,
      ),
    );
    drupal_add_js($settings, 'setting');
  }

3. Add a container element in your template where you would like the chart drawn.

.. code-block:: html

  <div id="tripald3-simplelineplot" class="tripald3-diagram" style="width: 800px;">
  <!-- Javascript will add a Simple LinePlot, Title and Figure legend here -->
</div>


4. Draw the chart in your template by calling `tripalD3.drawChart()`. This is done within a script tag using Drupal behaviours to ensure it is run at the correct point and the data prepared is passed in.

.. code-block:: html

  <script type="text/javascript">
    Drupal.behaviors.tripalD3demoSimpleLinePlot = {
    attach: function (context, settings) {

      //Pull the data out of the javascript settings.
	var data = Drupal.settings.demo.stockTypeLinePlotData;

      // Draw chart
      tripalD3.drawFigure(
        linePlotData,
        {
          "chartType" : "simplelineplot",
          "elementId": "tripald3-simplelineplot",
          "height": 500,
          "width": 1000,
          "keyPosition": "right",
        }
      );


    }
  };
  </script>
