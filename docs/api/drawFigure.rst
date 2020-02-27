
drawFigure
============

This function is a common set-up function meant to ensure that figures are consistent, as well as, to facilitate common options. Furthermore, it should make it easier for developers as they only need to remember the name of a single function.

Specifically, this function adds the necessary markup for a figure containing chart svg, figure legend and key. It also ensures that any pre-existing chart, legend, key are removed prior to drawing of the chart. Furthermore, it calls the specific chart drawing functions.

Source Code: ``js/tripalD3.js``

def ``drawFigure(data, options)``:

  Used to draw any diagram. Your main entry pointo to the API.

  :data: A javascript object with the data required to draw the chart. The specifics of this object depend on the chart being drawn.
  :options: A javascript object with any of the following keys:

    :chartType: the type of chart to draw; (REQUIRED) one of pedigree, simplepie, simpledonut, multidonut, simplebar, simplehistogram.
    :elementId: The ID of the HTML element the diagram should be attached to.
    :width: The width of the drawing canvas (including key and margins) in pixels.
    :height: The height of the drawing canvas (including key and margins) in pixels.
    :title: the title of the figure diagram.
    :legend: a longer description of the diagram to be used as the figure legend following the title. This should include all  relevant scientific information as well as instructions on how to interact with the chart.
    :margin: an object with 'top', 'right','bottom','left' keys. Values are in pixels and all four keys must be set.
    :chartOptions: an object containing options to be passed to the chart. See chart documentation to determine what options are available.
    :drawKey: whether or not to draw the key; default is "true".
    :keyPosition: control the position of the key on your figure; supported options include right (default) or left.
    :keyWidth: the key is fixed width; default width is 250 (pixels).
    :key: an object containing additional options for the key. See "drawKey" function for all available options. Some include:

        :title: the title of the key; default "Legend".
        :margin: an object with 'top', 'right','bottom','left' keys. Values are in pixels and all four keys must be set.

drawKey
---------

This function is called by ``drawFigure`` where ``drawKey: true``. Draws a graphical key on an existing diagram to explain the colours and styles used.

Source Code: ``js/tripalD3.js``

def ``drawKey(data, options)``:

  Called by ``drawFigure`` where ``drawKey: true``.

  :data: An array of key items where each item is an object with the following keys:

    :classes: the classes attached to the item represented. These are applied to the colored item of the key (circle, rect, path).
    :groupClasses: additional classes to attach to the grouping element in the key. The type of element is added by default.
    :label: The human-readable label for this key item.
    :type: the type of svg element this key item represents. Supported types include: circle, rect, path.
    :fillColor: the color of the circle/rect.
    :strokeColor: the color of the line.

  :options: A javascript object with any of the following keys:

    :parentId: the ID of the parent element containing the SVG to draw the key on (REQUIRED).
    :elementId: the ID to use for the grouping element containing the key.
    :width: the width of the key in pixels (REQUIRED).
    :height: the height of the key in pixels. The default is calculated based on the number of key elements passed in.
    :margin: the margin to use for the key. an object with 'top', 'right', 'bottom','left' keys. Values are in pixels and all four keys must be set.
