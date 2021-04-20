
Use Colour Schemes in your JS
==============================

If you are making a custom chart, you can pick your colours using this API to make sure it is consistent with all your other diagrams! I also highly recommend adding a figure legend to inform your users and keep things consistent!

.. code-block:: php

  // The colors variable is a simple array of HEX Codes.

  // Retrieve the user set colour scheme...

  // Categorical: Maximize contrast for showing different categories.
  var colors = tripalD3.getColorScheme("categorical");

  // Quantitative: for a gradient.
  var colors = tripalD3.getColorScheme("quantitative");
