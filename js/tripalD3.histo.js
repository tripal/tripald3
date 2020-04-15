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
    
       var lowColor = "#bceb65";
      var  highColor = "#9ed141";
   

 // Check the data is compliant.
    var compliant = tripalD3.test.isFrequencyDataCompliant(data);
    if (!compliant) {return false; }
    
  
   var errors = false;
 
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
      options.yAxisPadding = 60;
    }
    if (!options.hasOwnProperty('barColor')) {
      var colors = tripalD3.getColorScheme("categorical");
      options.barColor = colors[0];
    }

//Set X axis scale
      var x = d3.scale.linear()
        .domain([min, max])
        .range([options.xAxisPadding, options.width]);
          
          
    
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
        .range([options.height - options.yAxisPadding, 0]);


        //Set color scale before threshold      
      var lowColorScale = d3.scale.linear()
        .domain([yMin, yMax])
        .range([d3.rgb(lowColor).brighter(), d3.rgb(lowColor).darker()]);

      //Set color scale after threshold
      var highColorScale = d3.scale.linear()
        .domain([yMin, yMax])
        .range([d3.rgb(highColor).brighter(), d3.rgb(highColor).darker()]);

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
        .attr("x", 1)
        .attr("width", (x(hist[0].dx) - x(0)) - 0.5)
        .attr("height", function(d) {
          return options.height - y(d.y);
        })
         .attr("fill", function(d) {
          return lowColorScale(d.y)
        })
        .style("stroke", function(d) {return highColorScale(d.y)})
        .style("stroke-width", "3px")
    
    //Make x axis
      var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
          .outerTickSize(1);

      //Draw x axis    
      svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (options.height - options.yAxisPadding) + ")")
        .call(xAxis);
  
  },
};
