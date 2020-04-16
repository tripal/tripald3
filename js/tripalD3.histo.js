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
   * @param options
   *   An object containing options for this chart. Supported keys include:
   *     - xAxisTitle: The title of the X-Axis.
   *     - yAxisTitle: The title of the Y-Axis.
   *     - width: The width of the drawing canvas (including key and margins) in pixels.
   *     - height: The height of the drawing canvas (including key and margins) in pixels.
   *     - xAxisPadding: the number of pixels to pad the left side to provide room
   *         for the y-axis labels.
   *     - yAxisPadding: the number of pixels to pad the bottom to provide room
   *         for the x-axis labels.
   *     - lowColor: The base color for the color scale to be applied to the bars.
   *     - highColor: The base color for the color scale to be applied to the bars under the threshold.
   */
  
  
  drawSimpleHistogram: function(svg, data, options) {

    // Check the data is compliant.
    var compliant = tripalD3.test.isFrequencyDataCompliant(data);
    if (!compliant) {return false; }
  
    var errors = false;
 
    if (errors) { return false; }

    //Set Defaults.
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
    
    //For drag behavior    
      var drag = d3.behavior.drag();
      var activeClassName = 'active-d3-item';
    
    //Colors for color scale
      var lowColor = "#2571b0";
      var highColor = "#1066ad";
    
    //Get max and min of data for X axis
      var max = d3.max(data),
          min = d3.min(data);
    
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
          .attr("transform", function(d) {return "translate(" + x(d.x) + "," + y(d.y) + ")";});

    //Draw the columns
      column.append("rect")
          .attr("x", 1)
          .attr("y", -62)
          .attr("width", (x(hist[0].dx) - x(0)) - 0.5)
          .attr("height", function(d) {return options.height - y(d.y);})
          .attr("fill", function(d) {return lowColorScale(d.y)})
          .style("stroke", function(d) {return highColorScale(d.y)})
          .style("stroke-width", "3px")
    
    //Data for the threshold line
      var thresholdOrigin = [{
        'x1': 5,
        'y1': -50,
        'x2': 5,
        'y2': 425
      }];

    //Generate the svg lines attributes
      var lineAttributes = {
        'x1': function(d) {return d.x1;},
        'y1': function(d) {return d.y1;},
        'x2': function(d) {return d.x2;},
        'y2': function(d) {return d.y2;}
      };

    //Drag behavior for the threshold line
      var drag = d3.behavior.drag()
          .origin(function(d) {return d;})
          .on('dragstart', dragstarted)
          .on('drag', dragged)
          .on('dragend', dragended);

    //Pointer to the d3 lines
      var lines = svg
          .selectAll('line')
          .data(thresholdOrigin)
          .enter()
          .append('line')
          .attr(lineAttributes)
          .call(drag);

    //Start drag function
      function dragstarted() {
          d3.select(this).classed(activeClassName, true);
      }

    //Drag function
      function dragged() {
          var x = d3.event.dx;
          var y = d3.event.dy;
          var line = d3.select(this);
          var xWidth = max - min;
          var ration = 1000 / xWidth;
          var offset = xWidth / 2;
          var linePosition = ((lines.attr("x2") / ration) + 50);
          var formatNumber = d3.format(",.0f");
          var formatter = function(d) {return formatNumber(d)};
          var scaledPosition = formatNumber(linePosition);         

          d3.selectAll("rect")
            .attr("fill", function(d) {
                if (d.x <= (linePosition)) {
                    return highColorScale(d.y);
                } 
                else {
                    return lowColorScale(d.y);
                }
            })
            .style("stroke", function(d) {
          	    if (d.x <= linePosition) {
                    return lowColorScale(d.y);
                }
                else {
                    return highColorScale(d.y)
                }
           })
            .style("stroke-width", "3px")
        
        //Update threshold line properties after drag event
          var attributes = {
              x1: parseInt(line.attr('x1')) + x,
              y1: parseInt(line.attr('y1')),

              x2: parseInt(line.attr('x2')) + x,
              y2: parseInt(line.attr('y2')),
          };
          line.attr(attributes);
          }

    //End drag function
        function dragended() {
            d3.select(this).classed(activeClassName, false)
        };
    
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
