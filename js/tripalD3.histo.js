/**
 * @file
 * Bar Chart functionality.
 */
tripalD3.histo = {

  /**
   * Draw a simple bar chart.
   *
   * @param svg
   *   The canvas to draw the bar chart on.
   * @param data
   *   An array of objects (one object per bar)
   *   with the following keys:
   *     - label: the human-readable label for this bar.
   *     - count: the number of items in the bar.
   * @param options
   *   An object containing options for this chart. Supported keys include:
   *     - xAxisTitle: The title of the X-Axis.
   *     - yAxisTitle: The title of the Y-Axis.
   *     - width: The width of the drawing canvas (including key and margins) in pixels.
   *     - height: The height of the drawing canvas (including key and margins) in pixels.
   *     - drawKey: whether or not to draw the key; default is "false".
   *     - xAxisPadding: the number of pixels to pad the left side to provide room
   *         for the y-axis labels.
   *     - yAxisPadding: the number of pixels to pad the bottom to provide room
   *         for the x-axis labels.
   */
  drawSimpleHistogram: function(svg, data, options) {

    /** Check the data is compliant.
    if (!Array.isArray(data)) {
      console.error("The data should be an ARRAY where each element has a label and a count.");
      return false;
    }
    var errors = false;
    data.forEach(function(element) {
      if (!("label" in element)) {
        console.error("Every element must be an object with a LABEL key. This element doesn't comply: " + JSON.stringify(element));
        errors = true;
      }
            if (!("count" in element)) {
        console.error("Every element must be an object with a COUNT key. This element doesn't comply: " + JSON.stringify(element));
        errors = true;
            }
              });
    if (errors) { return false; }
*/


    // Set Defaults.
    if (!options.hasOwnProperty('xAxisTitle')) {
      options.xAxisTitle = "";
    }
    if (!options.hasOwnProperty('yAxisTitle')) {
      options.yAxisTitle = "";
    }
    if (!options.hasOwnProperty('xAxisPadding')) {
      options.xAxisPadding = 60;
    }
    if (!options.hasOwnProperty('yAxisPadding')) {
      options.yAxisPadding = 90;
    }
    if (!options.hasOwnProperty('barColor')) {
      var colors = tripalD3.getColorScheme("categorical");
      options.barColor = colors[0];
    }



    // Scales & Axis'.
    var x = d3.scale.ordinal().rangeRoundBands([options.xAxisPadding, options.width], .2);
    var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .outerTickSize(1);
    var y = d3.scale.linear().range([options.height - options.yAxisPadding, 0]);
    var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .ticks(5)
      .outerTickSize(1);

    // Setting up ranges for the axis'.
    x.domain(data.map(function(d) { return d.label; }));
    y.domain([0, d3.max(data, function(d) { return d.count; })]);
/**
    // Actually draw the y-axis.
    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + options.xAxisPadding + ",0)")
        .call(yAxis)
      // NOTE: we use negative coordinates b/c rotating -90
      // places us in Quadrants III (-x,-y).
      .append("text")
        .attr("class", "axis-title")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - options.xAxisPadding)
        .attr("x", 0 - ((options.height - options.yAxisPadding) / 2))
        .style("text-anchor", "middle")
        .style("font-weight", "bold")
        .text(options.yAxisTitle);
*/
    // Actually draw the x-axis.
    svg.append("g")
    .attr("class", "x axis")
        .attr("transform", "translate(0," + (options.height - options.yAxisPadding) + ")")
        .call(xAxis)
      .append("text")
        .attr("class", "axis-title")
        .attr("x", options.width/2)
        .attr("y", options.yAxisPadding - 15)
        .attr("dy", ".71em")
        .style("text-anchor", "middle")
        .style("font-weight", "bold")
        .text(options.xAxisTitle);

    // Better style the x-axis.
    // Fix the labels.
    svg.selectAll(".x.axis .tick text")
      .style("text-anchor", "end")
      .attr("transform", "rotate(-45)" )
      .attr("x", -8)
      .attr("y", 2);
    // Make the ticks actually visible ;-).
    svg.selectAll(".axis .tick line")
      .style("stroke", "black")
      .style("stroke-width", "1px")
      .style("shape-rendering", "crispEdges");

    // Draw the bars :-).
    svg.selectAll("bar")
        .data(data)
      .enter().append("bar")
        .style("fill", options.barColor)
        .attr("x", 1)
        .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
        .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
        .attr("height", function(d) { return options.height - y(d.length); })
        }
  };
