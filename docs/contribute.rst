
Contributing
==============

We’re excited to work with you! Post in the issues queue with any questions, feature requests, or proposals.

General Goals & Tips
----------------------

 - Highlight your functionality in the `demo page <https://github.com/tripal/tripald3/blob/7.x-1.x/templates/tripald3_demo_page.tpl.php>`_ (``admin/tripal/extension/tripald3/demo``) without removing any of the charts already there. This makes it easy for me to review and gives you a place to test your chart.
 - Ensure your functionality doesn't break existing charts by checking the demo page and confirming all the charts are drawn correctly.
 - You can use the `test page <https://github.com/tripal/tripald3/blob/7.x-1.x/templates/tripald3_test_page.tpl.php>`_ (``admin/tripal/extension/tripald3/test``) to ensure that data is validated correctly or to check edge cases. This is a great place to demonstrate any bugs you are fixing!
 - For new chart types,
    - Any new chart types should be called through `drawFigure() <https://tripal-d3js-api.readthedocs.io/en/latest/api/drawFigure.html>`_.
    - Colours should be chosen using the Color Scheme API (i.e `getColorScheme() <https://tripal-d3js-api.readthedocs.io/en/latest/api/getColorScheme.html>`_) so that all diagrams look consistent.
    - Use `popovers <https://tripal-d3js-api.readthedocs.io/en/latest/api/popover.html>`_ included with this API for information provided on hover.
