
Custom Colour Schemes
=======================

Making your own colour scheme available to this module is as simple as implementing a single hook in your custom module. For example, if your module was named `mymodule`, then you would implement `hook_tripald3_color_schemes()` as follows:

.. code-block:: php

  /**
   * Implements hook_tripald3_color_schemes().
   */
  function mymodule_tripald3_color_schemes() {
    $color_schemes = array();

    // This key should be unique across colour schemes.
    $color_schemes['PrpGr'] = array(
      // This name will show up in the colour scheme configuration
      'name' => 'Purple-Green',
      // These are the colours your colour scheme consists of.
      'colors' => array('#3d4051', '#753fb0', '#8f7abf', '#294090', '#6683c3', '#0C6758', '#7AB318', '#A0C55E', '#9fa7a3'),
      'pick order' => array(
        // This is the order of the above colours when picking for a
        // qualitative chart (e.g. heatmap).
        'quantitative' => array(0, 1, 2, 3, 4, 5, 6, 7, 8),
        // This is the order for a categorical chart (e.g. pie chart)
        'categorical' => array(3, 6, 1, 4, 5, 8, 2, 7, 0)
      ),
    );

    return $color_schemes;
  }

Then just go to the configuration form (Admin » Tripal » Extension Modules » Tripal D3 Diagrams) and choose your colour scheme to see it used in all your diagrams! If you don't yet have diagrams, see your colour scheme in action by clicking on the demo tab.
