/**
 * @file
 * Histogram functionality.
 */
tripalD3.histo = {

  /**
   * Draw a simple histogram.
   *
   * @param svg
   *   The canvas to draw the histogram on.
   * @param data
   *   An array of objects (one bar represents the frequency of objects with that value)
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
   *     - lowColor: The base color for the color scale to be applied to the bars.
   *     - highColor: The base color for the color scale to be applied to the bars under the threshold.
   */
  drawSimpleHistogram: function(svg, data, options) {
    
    
     //Get max and min of data for X axis
      var max = d3.max(data),
        min = d3.min(data);
    
    var drag = d3.behavior.drag();
       var lowColor = "#bceb65";
      var  highColor = "#9ed141";
    
    //Set color scale before threshold      
      var lowColorScale = d3.scale.linear()
        .range([d3.rgb(lowColor).brighter(), d3.rgb(lowColor).darker()]);

      //Set color scale after threshold
      var highColorScale = d3.scale.linear()
        .range([d3.rgb(highColor).brighter(), d3.rgb(highColor).darker()]);

 // Check the data is compliant.
    var compliant = tripalD3.test.isFrequencyDataCompliant(data);
    if (!compliant) {return false; }
    
  
   var errors = false;
  /**
    data.forEach(function(element) {
      if (!("label" in element)) {
        console.error("Every element must be an object with a LABEL key. This element doesn't comply: " + JSON.stringify(element));
        errors = true;
      }
      if (!("count" in element)) {
        console.error("Every element must be an object with a COUNT key. This element doesn't comply: " + JSON.stringify(element));
        errors = true;
      }
      */
   // });
  if (errors) { return false; }

    // Set Defaults.
    if (!options.hasOwnProperty('xAxisTitle')) {
      options.xAxisTitle = "";
    }
    if (!options.hasOwnProperty('yAxisTitle')) {
      options.yAxisTitle = "";
    }
    if (!options.hasOwnProperty('xAxisPadding')) {
      options.xAxisPadding = 30;
    }
    if (!options.hasOwnProperty('yAxisPadding')) {
      options.yAxisPadding = 30;
    }
    if (!options.hasOwnProperty('barColor')) {
      var colors = tripalD3.getColorScheme("categorical");
      options.barColor = d3.scale.linear()
        .range([d3.rgb(lowColor).brighter(), d3.rgb(lowColor).darker()]);
    }

//Set X axis scale
      var x = d3.scale.linear()
        .domain([min, max])
        .range([0, options.width]);
    
      //Make a histogram layout with 30 bins
      var hist = d3.layout.histogram()
        .bins(x.ticks(30))
        (data);

      //Get max and min of histogram bins
      var yMax = d3.max(hist, function(d) {return d.length}),
          yMin = d3.min(hist, function(d) {return d.length});

   //Set Y axis scale
      var y = d3.scale.linear()
        .domain([0, yMax])
        .range([options.height, 0]);

//Make x axis
      var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

      //Draw x axis    
      svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + options.height + ")")
        .call(xAxis);
  
/**
    // Scales & Axis'.
    var x = d3.scale.ordinal().rangeRoundBands([options.xAxisPadding, options.width], 0.01, 0.2);
    var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .outerTickSize(1);
    var y = d3.scale.linear().range([options.height - options.yAxisPadding, 0]);
    var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .ticks(11)
      .outerTickSize(1);
    */
   
/**
    // Setting up ranges for the axis'.
    x.domain(data.map(function(d) { return d.label; }));
    y.domain([0, d3.max(data, function(d) { return d.count; })]);
*/
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
      */
/**
    // Draw the bars :-).
    svg.selectAll("bar")
        .data(data)
      .enter().append("rect")
        .style("fill", options.barColor)
        .attr("x", function(d) { return x(d.label); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d.count); })
        .attr("height", function(d) { return options.height - options.yAxisPadding - y(d.count); });
        */

//Make the columns
      var column = svg.selectAll(".column")
        .data(hist)
        .enter()
        .append("g")
        .attr("class", "column")
        .attr("transform", function(d) {
          return "translate(" + x(d.x) + "," + y(d.y) + ")";
        });


      //Draw the columns
      column.append("rect")
        .attr("x", 0)
        .attr("width", (x(hist[0].dx) - x(0)) - 0.5)
        .attr("height", function(d) {
          return options.height - y(d.y);
        })
        .attr("fill", "red")
  },
};
