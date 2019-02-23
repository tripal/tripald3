
drawMultiDonut
================

.. warning::

  This function should not be used directly. Instead use ``drawFigure`` where ``options.chartType = simplepie``

Source Code: ``js/tripalD3.pie.js``

def ``drawMultiDonut(svg, data, options)``

  Draw a multi-series Donut Chart

  :svg: The canvas to draw the chart on.
  :data: An array of objects (one object per series or pie ring) with the following keys:
  
    :label: the human-readable label for the data series. This will be used to label the ring.
    :parts: an array of objects (one object per category or pie-wedge) with the following keys:

      :label: the human-readable label for this category (pie-wdge).
      :count: the number of items in the category. This is used to determine the size of the wedge and MUST BE AN INTEGER.

  :options: A javascript object providing values to customization options. Supported options include:

    :width: The width of the drawing canvas (including key and margins) in pixels.
    :height: The height of the drawing canvas (including key and margins) in pixels.
    :maxRadius: the maximum radius of the pie chart.
    :donutWidth: the width of each ring.
    :labelPadding: the number of pixels between the series labels and the right edge of the pie chart.
    :drawKey: whether or not to draw the key; default is "true".
