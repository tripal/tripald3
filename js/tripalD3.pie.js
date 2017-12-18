/**
 * @file
 * Simple Pie Chart functionality.
 */
tripalD3.pie = {

  /**
   * Draw a simple pie chart.
   *
   * @param svg
   *   The canvas to draw the pie chart on.
   * @param data
   *   An array of objects (one object per category or pie-wedge)
   *   with the following keys:
   *     - label: the human-readable label for this category (pie-wdge).
   *     - count: the number of items in the category. This is used to determine
   *         the size of the wedge and MUST BE AN INTEGER.
   * @param options
   *   An object containing options for this chart. Supported keys include:
   *     - width: The width of the drawing canvas (including key and margins) in pixels.
   *     - height: The height of the drawing canvas (including key and margins) in pixels.
   *     - maxRadius: the outside radius of the pie chart.
   *     - donutWidth: the width of the donut (difference between inner
   *         and outer radius).
   *     - timbitRadius: the inside radius of the donut.
   *     - labelPadding: the number of pixels between the series labels and
   *         the right edge of the pie chart.
   *     - drawKey: whether or not to draw the key; default is "true".
   */
  drawSimplePie: function(svg, data, options) {

    // A simple pie chart is basically a donut chart with no center cut-out.
    options.donutWidth = options.maxRadius;
    options.timbitRadius = 0;
    tripalD3.pie.drawSimpleDonut(svg, data, options);

  },

  /**
   * Draw a simple donut pie chart.
   *
   * @param svg
   *   The canvas to draw the pie chart on.
   * @param data
   *   An array of objects (one object per category or pie-wedge)
   *   with the following keys:
   *     - label: the human-readable label for this category (pie-wdge).
   *     - count: the number of items in the category. This is used to determine
   *         the size of the wedge and MUST BE AN INTEGER.
   * @param options
   *   An object containing options for this chart. Supported keys include:
   *     - width: The width of the drawing canvas (including key and margins) in pixels.
   *     - height: The height of the drawing canvas (including key and margins) in pixels.
   *     - maxRadius: the outside radius of the pie chart.
   *     - donutWidth: the width of the donut (difference between inner
   *         and outer radius).
   *     - timbitRadius: the inside radius of the donut.
   *     - labelPadding: the number of pixels between the series labels and
   *         the right edge of the pie chart.
   *     - drawKey: whether or not to draw the key; default is "true".
   */
  drawSimpleDonut: function(svg, data, options) {

    // Set defaults.
    if (!options.hasOwnProperty('width')) {
      options.width = 250;
    }
    if (!options.hasOwnProperty('height')) {
      options.height = 250;
    }
    if (!options.hasOwnProperty('maxRadius')) {
      options.maxRadius = (options.height - options.margin.top - options.margin.bottom) / 2;
    }
    if (!options.hasOwnProperty('donutWidth')) {
      options.donutWidth = Math.floor(options.maxRadius / 2);
    }
    //Inside joke, donutHole ;-).
    if (!options.hasOwnProperty('timbitRadius')) {
      options.timbitRadius = options.maxRadius - options.donutWidth - 4;
    }
    if (!options.hasOwnProperty('labelPadding')) {
      options.labelPadding = options.width - options.height - 300;
    }
    if (!options.hasOwnProperty('drawKey')) {
      options.drawKey = true;
    }

    // Make sure we're drawing from the center of the canvas.
    var centerTop = options.maxRadius + options.margin.top;
    var centerLeft = options.maxRadius + options.margin.left;
    svg.attr("transform", "translate(" + centerLeft + "," + centerTop + ")");

    // Set-up the colors to use.
    var colors = tripalD3.getColorScheme("categorical");
    var categories = [];
    data.forEach(function(d) {
      categories.push(d.label);
    });
    var color = d3.scale.ordinal()
      .range(colors)
      .domain(categories);

    // Draw the circle background.
    svg.append("circle")
      .attr("class", "pie-background")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", options.maxRadius-1)
      .attr("fill", "#808080");
    svg.append("circle")
      .attr("class", "pie-center")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", options.timbitRadius)
      .attr("fill", "#FFF");

    // Actually draw each ring/donut in the pie chart based on the data provided.
    var ringOptions = {
      "donutWidth": options.donutWidth,
      "color": color,
    }
    tripalD3.pie.drawRing(svg, data, 0, options.maxRadius-2, ringOptions);

    // Draw the Key.
    if (options.drawKey === true) {
      var keyData = [];
      data.forEach(function(d) {
        var labelClass = d.label.replace(/ /g,'-').replace(/[!\"#$%&'\(\)\*\+,\.\/:;<=>\?\@\[\\\]\^`\{\|\}~]/g, '');
        keyData.push({
          'classes': ['pie', 'category', labelClass],
          'type': 'rect',
          'label': d.label,
          'fillColor': color(d.label)
        });
      });
      tripalD3.drawKey(keyData, options.key);
    }
  },

  /**
   * Draw a multi-series Donut Chart
   *
   * @param svg
   *   The canvas to draw the chart on.
   * @param data
   *   An array of objects (one object per series or pie ring)
   *   with the following keys:
   *     - label: the human-readable label for the data series. This will be used
   *       to label the ring.
   *     - parts: an array of objects (one object per category or pie-wedge)
   *         with the following keys:
   *          - label: the human-readable label for this category (pie-wdge).
   *          - count: the number of items in the category. This is used to
   *             determine the size of the wedge and MUST BE AN INTEGER.
   * @param options
   *   A javascript object providing values to customization options. Supported
   *   options include:
   *     - width: The width of the drawing canvas (including key and margins) in pixels.
   *     - height: The height of the drawing canvas (including key and margins) in pixels.
   *     - maxRadius: the maximum radius of the pie chart.
   *     - donutWidth: the width of each ring.
   *     - labelPadding: the number of pixels between the series labels and
   *         the right edge of the pie chart.
   *     - drawKey: whether or not to draw the key; default is "true".
   */
  drawMultiDonut: function(svg, data, options) {

    // Set defaults.
    if (!options.hasOwnProperty('width')) {
      options.width = 250;
    }
    if (!options.hasOwnProperty('height')) {
      options.height = 250;
    }
    if (!options.hasOwnProperty('maxRadius')) {
      options.maxRadius = (options.height - options.margin.top - options.margin.bottom) / 2;
    }
    if (!options.hasOwnProperty('donutWidth')) {
      options.donutWidth = Math.floor(options.maxRadius / data.length);
    }
    if (!options.hasOwnProperty('labelPadding')) {
      options.labelPadding = 60;
    }
    if (!options.hasOwnProperty('drawKey')) {
      options.drawKey = true;
    }

    // Make sure we're drawing from the center of the canvas.
    var centerTop = options.maxRadius + options.margin.top;
    var centerLeft = options.maxRadius + options.margin.left;
    svg.attr("transform", "translate(" + centerLeft + "," + centerTop + ")");

    // Set-up the colors to use.
    var colors = tripalD3.getColorScheme("categorical");

    // Determine the full set of categories...
    // @todo sort the categories by number of elements?
    var categories = [];
    data.forEach(function(d1) {
      d1.parts.forEach(function(d2) {
        if (categories.indexOf(d2.label) === -1) {
          categories.push(d2.label);
        }
      });
    });

    // Function to pick a color per category.
    var color = d3.scale.ordinal()
      .range(colors)
      .domain(categories);

    // Draw the circle background.
    svg.append("circle")
      .attr("class", "pie-background")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", options.maxRadius-1)
      .attr("fill", "#808080");

    // Actually draw each ring/donut in the pie chart based on the data provided.
    data.forEach(function(element, index, array){
      var ringOptions = {
        "donutWidth": options.donutWidth,
        "color": color,
        "label": data[index].label,
      }
      var _outerRingRadius = options.donutWidth * (index+1);
      tripalD3.pie.drawRing(svg, data[index].parts, index, _outerRingRadius, ringOptions);
    });

    // Label the series/donut rings.
    svg.append("g")
      .attr("class", "series-labels");
    data.forEach(function(element, index, array){
      var _outerRingRadius = options.donutWidth * (index+1);
      var labelOptions = Object.assign({}, options);
      labelOptions.totalElements = data.length;
      tripalD3.pie.drawDonutLabel(svg, data[index], index, _outerRingRadius, options.maxRadius, labelOptions);
    });

    // Draw the Key.
    if (options.drawKey === true) {
      var keyData = [];
      categories.forEach(function(d) {
        var labelClass = d.replace(/ /g,'-').replace(/[!\"#$%&'\(\)\*\+,\.\/:;<=>\?\@\[\\\]\^`\{\|\}~]/g, '');
        keyData.push({
          'classes': ['pie', 'category', labelClass],
          'type': 'rect',
          'label': d,
          'fillColor': color(d),
        });
      });
      tripalD3.drawKey(keyData, options.key);
    }

    // If there is only a single series then we would like to make this a donot chart.
    if (data.length == 1) {
      svg.append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", donutWidth/3)
        .attr("fill", "#FFF")
        .attr("stroke", "#808080")
        .attr("stroke-width", 2);
    }
  },

  /**
   * HELPER FUNCTION: Draws a the segments/wedges of a single ring.
   *
   * The data provided should be specific to that particular ring/donut, the
   * index is the 0-indexed order and the radius is the maximum radius
   * for this ring.
   *
   * @param svg
   *   The canvas to draw the ring on.
   * @param _data
   *   The data specific to this particular ring of the pie chart.
   *   Specifically, an array of objects (one object per category or pie-wedge)
   *   with the following keys:
   *     - label: the human-readable label for this category (pie-wdge).
   *     - count: the number of items in the category. This is used to determine
   *         the size of the wedge and MUST BE AN INTEGER.
   * @param index
   *   The index for this particular ring in the case that the completed pie
   *   chart has multiple rings. If there is only a single ring then this
   *   should be set to 0.
   * @param radius
   *   The outside radius of the ring.
   * @options
   *   An object containing options for this ring. Supported keys include:
   *     - donutWidth: the width of the donut (REQUIRED).
   *     - label: the label for this ring. Helpful in the case of multiple
   *         rings for a single pie chart. The label is used as a CSS class
   *         with spaces transformed.
   */
  drawRing: function(svg, _data, index, radius, options) {

    // Set Defaults.
    if (!options.hasOwnProperty('label')) {
      options.label = "";
    }
    if (!options.hasOwnProperty('donutWidth')) {
      console.error("You must supplie the width of the donut to drawRing since it depends on the chart type and the number of rings.");
      return;
    }

    // Set up function to draw the arc.
    var arc = d3.svg.arc()
      .outerRadius(radius - 2)
      .innerRadius(radius - options.donutWidth);

    // Set up the function to draw the pie.
    var pie = d3.layout.pie()
      .sort(null)
      .value(function(d) { return d.count; });

    // Make the series name class-compatible (if there is one).
    var seriesName = "";
    if (options.label) {
      seriesName = "m" + options.label.replace(/ /g,'-').replace(/[!\"#$%&'\(\)\*\+,\.\/:;<=>\?\@\[\\\]\^`\{\|\}~]/g, '');
    }

    // Create the ring grouping element.
    var ring = svg.append("g")
      .attr("class", "ring series " + seriesName);

    // Create the elements per category.
    var g = ring.selectAll(".arc")
        .data(pie(_data))
      .enter().append("g")
        .attr("class", function(d) {
          var _label = d.data.label.replace(/ /g,'-').replace(/[!\"#$%&'\(\)\*\+,\.\/:;<=>\?\@\[\\\]\^`\{\|\}~]/g, '');
          return "arc marker-name " + _label;
        });

    // Actually draw the arcs.
    g.append("path")
      .attr("d", arc)
      .style("fill", function(d) { return options.color(d.data.label); })
      .attr("class", function(d) {
        var _label = d.data.label.replace(/ /g,'-').replace(/[!\"#$%&'\(\)\*\+,\.\/:;<=>\?\@\[\\\]\^`\{\|\}~]/g, '');
        return 'pie category ' + _label;
      })
      .append("svg:title")
        .text(function(d) { return d.data.label + ' (' + d.data.count + ')'; });

  },

  /**
   * HELPER FUNCTION: Labels a single ring in a multi-series pie chart.
   *
   * The labels are aligned on the right side of the chart
   * and then lines connect the label to the outer boundry of each
   * ring.
   *
   * @param svg
   *   The canvas containing the pie chart to be labelled.
   * @param _data
   *   The same data passed into drawRing. The series label is pulled from here.
   * @param index
   *   The index for this particular ring in the case that the completed pie
   *   chart has multiple rings.
   * @param radius
   *   The outer radius of the current ring.
   * @param outerRadius
   *   The outer/maximum radius for the entire pie chart.
   * @options
   *   An object containing the original options from the chart. The following
   *   are the options specifically used: maxRadius, labelPadding, donutWidth.
   *   Additional label-specific options include:
   *     - totalElements: the total number of rings/series in the chart.
   */
  drawDonutLabel: function(svg, _data, index, radius, outerRadius, options) {

    console.log(_data);

    var seriesName = "m" + _data.label.replace(/ /g,'-').replace(/[!\"#$%&'\(\)\*\+,\.\/:;<=>\?\@\[\\\]\^`\{\|\}~]/g, '');

    var label = svg.selectAll('.series-labels')
      .append("g")
        .attr("class", "label")
        .attr("class", seriesName);

    // Print out the labels in reverse order
    // with each label lining up with the top of a donut.
    label.append('text')
      .attr('x', options.maxRadius + options.labelPadding)
      .attr('y', options.donutWidth * (index - options.totalElements) + 10)
      .text(function(d) { return _data.label; });

    // Function to draw lines.
    var drawLine = d3.svg.line()
      .x(function(d) { return d.x; })
      .y(function(d) { return d.y; })
      .interpolate("linear");

    // Find the x coordinate on a circle when given y and the radius.
    function getPointX(y, radius) {
      return Math.cos(Math.asin(y/radius)) * radius;
    }

    var labelHeight = (radius - 2) * -1 + 5,
      xOnOuter = getPointX(labelHeight,outerRadius),
      offset = (options.donutWidth/2) * (options.totalElements - index + 1);

    midRadius = radius - (options.donutWidth/2);
    labelHeight = options.donutWidth * (index - options.totalElements) + 5;
    endY = options.donutWidth - 5;
    xOnOuter = getPointX(labelHeight,outerRadius)
    lineData = [  // A point just before (2px) the label.
                 { "x": options.maxRadius + options.labelPadding - 2,   "y": labelHeight},
                  // A point offset 10px from the edge of the outer arc
                  // where the line would eventually intersect the arc.
                 { "x": xOnOuter + 10,  "y": labelHeight},
                  // Draw line to donut.
                 { "x": getPointX(-endY, radius),  "y": -endY}
               ];
    label.append('path')
      .attr("d", drawLine(lineData))
      .attr("stroke", "#808080")
      .attr("stroke-width", 2)
      .attr("fill", "none");
  }
};
