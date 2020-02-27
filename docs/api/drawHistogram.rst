
drawHistogram
================

.. warning::

  This function should not be used directly. Instead use ``drawFigure`` where ``options.chartType = histogram``

Source Code: ``js/tripalD3.histogram.js``

def ``drawHistogram(svg, data, options)``

  Draw a simple histogram.

  :svg: The canvas to draw the histogram on.
  :data: An array of objects (one object per category or bar) with the following keys:

    :label: the human-readable label for this category (bar).
    :count: the number of items in the category. This is used to determine the length of the bar and MUST BE AN INTEGER.

  :options: An object containing options for this chart. Supported keys include:
  
    :xAxisTitle: The title of the X-Axis.
    :yAxisTitle: The title of the Y-Axis.
    :width: The width of the drawing canvas (including key and margins) in pixels.
    :height: The height of the drawing canvas (including key and margins) in pixels.
    :drawKey: whether or not to draw the key; default is "false".
    :xAxisPadding: the number of pixels to pad the left side to provide room for the y-axis labels.
    :yAxisPadding: the number of pixels to pad the bottom to provide room for the x-axis labels.

