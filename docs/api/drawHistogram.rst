
drawSimpleHistogram
================

.. warning::

  This function should not be used directly. Instead use ``drawFigure`` where ``options.chartType = histogram``

Source Code: ``js/tripalD3.histo.js``

def ``drawSimpleHistogram(svg, data, options)``

  Draw a simple histogram.

  :svg: The canvas to draw the histogram on.
  :data: An array of objects (one bar represents the frequency of objects with that value).

  :options: An object containing options for this chart. Supported keys include:
  
    :xAxisTitle: The title of the X-Axis.
    :yAxisTitle: The title of the Y-Axis.
    :width: The width of the drawing canvas (including key and margins) in pixels.
    :height: The height of the drawing canvas (including key and margins) in pixels.
    :drawKey: Whether or not to draw the key; default is "false".
    :xAxisPadding: The number of pixels to pad the left side to provide room for the y-axis labels.
    :yAxisPadding: The number of pixels to pad the bottom to provide room for the x-axis labels.
    :lowColor: The base color for the color scale to be applied to the bars.
    :highColor: The base color for the color scale to be applied to the bars under the threshold.

