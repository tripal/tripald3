
drawSimpleDonut
================

.. warning::

  This function should not be used directly. Instead use ``drawFigure`` where ``options.chartType = simplepie``

Source Code: ``js/tripalD3.pie.js``

def ``drawSimpleDonut(svg, data, options)``

  Draw a simple donut pie chart.

  :svg: The canvas to draw the pie chart on.
  :data: An array of objects (one object per category or pie-wedge) with the following keys:

    :label: the human-readable label for this category (pie-wdge).
    :count: the number of items in the category. This is used to determine the size of the wedge and MUST BE AN INTEGER.

  :options: An object containing options for this chart. Supported keys include:
  
    :width: The width of the drawing canvas (including key and margins) in pixels.
    :height: The height of the drawing canvas (including key and margins) in pixels.
    :maxRadius: the outside radius of the pie chart.
    :donutWidth: the width of the donut (difference between inner and outer radius).
    :timbitRadius: the inside radius of the donut.
    :labelPadding: the number of pixels between the series labels and the right edge of the pie chart.
    :drawKey: whether or not to draw the key; default is "true".
