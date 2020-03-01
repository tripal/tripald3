/**
 * @file
 * Histogram functionality.
 */
tripalD3.histogram = {

  /**
   * Draw a simple histogram.
   *
   * @param svg
   *   The canvas to draw the histogram on.
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
  
 // % % % ------------------------------- % % % --------------------------------------------------------------------
  drawSimpleHistogram: function(svg, data, options) {

    // Check the data is compliant.
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
      .ticks(1)
      .outerTickSize(1);

    // Setting up ranges for the axis'.
    x.domain(data.map(function(d) { return d.label; }));
    y.domain([0, d3.max(data, function(d) { return d.count; })]);

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
      .attr("x", -1)
      .attr("y", 2);
    // Make the ticks actually visible ;-).
    svg.selectAll(".axis .tick line")
      .style("stroke", "black")
      .style("stroke-width", "1px")
      .style("shape-rendering", "crispEdges");

    // Draw the bars :-).
    svg.selectAll("bar")
        .data(data)
      .enter().append("rect")
        .style("fill", options.barColor)
        .attr("x", function(d) { return x(d.label); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d.count); })
        .attr("height", function(d) { return options.height - options.yAxisPadding - y(d.count); });
  },
};
  
  /**
  drawHistogram: function(svg, data, options) {
    <script>

// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 40},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// get the data
d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/1_OneNum.csv", function(data) {

  // X axis: scale and draw:
  var x = d3.scaleLinear()
      .domain([0, 1000])     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
      .range([0, width]);
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // set the parameters for the histogram
  var histogram = d3.histogram()
      .value(function(d) { return d.price; })   // I need to give the vector of value
      .domain(x.domain())  // then the domain of the graphic
      .thresholds(x.ticks(70)); // then the numbers of bins

  // And apply this function to data to get the bins
  var bins = histogram(data);

  // Y axis: scale and draw:
  var y = d3.scaleLinear()
      .range([height, 0]);
      y.domain([0, d3.max(bins, function(d) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously
  svg.append("g")
      .call(d3.axisLeft(y));

  // append the bar rectangles to the svg element
  svg.selectAll("rect")
      .data(bins)
      .enter()
      .append("rect")
        .attr("x", 1)
        .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
        .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
        .attr("height", function(d) { return height - y(d.length); })
        .style("fill", "#69b3a2")

});
</script>
};
}
*/
