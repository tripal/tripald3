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
          
    //Colors for color scale
      var highlightColor = "#4682B4";
      var includedColor = "#266091";
      var excludedColor = "#ffffff";
    
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

    //Set excluded color scale     
      var excludedColorScale = d3.scale.linear()
         .domain([yMin, yMax])
         .range([d3.rgb(excludedColor).brighter(), d3.rgb(excludedColor).darker()]);

    //Set included color scale
      var includedColorScale = d3.scale.linear()
         .domain([yMin, yMax])
         .range([d3.rgb(includedColor).brighter(), d3.rgb(includedColor).darker()]);
    
    //Set highlight color scale
      var highlightColorScale = d3.scale.linear()
          .domain([yMin, yMax])
          .range([d3.rgb(highlightColor).brighter(), d3.rgb(highlightColor).darker()]);

    //Make the bars
      var bars = svg.selectAll()
          .data(hist)
          .enter()
          .append("g")
          .attr("transform", function(d) {return "translate(" + x(d.x) + "," + y(d.y) + ")";});

    //Draw the bars
      bars.append("rect")
          .attr("x", 0)
          .attr("y", -62)
          .attr("width", (x(hist[0].dx) - x(0)) - 4)
          .attr("height", function(d) {return options.height - y(d.y);})
          .attr("fill", function(d) {return excludedColorScale(d.y)})
          .style("stroke", function(d) {return includedColorScale(d.y)})
          .style("stroke-width", "3px")
    
    //Data for the upper threshold line
      var upperThresholdOrigin = [{
        'x1': 35,
        'y1': -62,
        'x2': 35,
        'y2': 425
      }];
    
    //Data for the lower threshold line
      var lowerThresholdOrigin = [{
        'x1': 29,
        'y1': -62,
        'x2': 29,
        'y2': 425
      }];  

    //Generate the threshold lines' attributes
      var lineAttributes = {
        'x1': function(d) {return d.x1;},
        'y1': function(d) {return d.y1;},
        'x2': function(d) {return d.x2;},
        'y2': function(d) {return d.y2;}
      };

    //Drag behavior for the threshold line
      var drag = d3.behavior.drag()
          .origin(function(d) {return d;})
          .on('drag', dragged);

    //Pointer to the threshold lines
      var line1 = svg.append('line').data(upperThresholdOrigin).attr(lineAttributes).call(drag);
      var line2 = svg.append('line').data(lowerThresholdOrigin).attr(lineAttributes).call(drag);
    
    //Drag function
      function dragged() {
          var x = d3.event.dx;
          var y = d3.event.dy;
          var line = d3.select(this);
          var xAxisScale = d3.scale.linear().domain([0, options.width]).range([min, max]);
          var upperLinePosition = xAxisScale(line1.attr("x2"));
          var lowerLinePosition = xAxisScale(line2.attr("x2"));
          var formatter = d3.format(".2r");
          var upperScaledPosition = formatter(upperLinePosition); 
          var lowerScaledPosition = formatter(lowerLinePosition);
        
          //Update threshold line properties after drag event
          var attributes = {
              x1: parseInt(line.attr('x1')) + x,
              y1: parseInt(line.attr('y1')),

              x2: parseInt(line.attr('x2')) + x,
              y2: parseInt(line.attr('y2')),
          };
        
          //For threshold 'container'    
          var newX1 = attributes.x1;
    
          //Revert line to the edge of the chart if dragged outside the chart 
          attributes.x1 = function(d) {
              if (newX1 < 31) {
                return 31;
              } 
              else  if (newX1 > 711) {
                return 711;
              } 
              else {
                return newX1;
              }
          };
                    
          attributes.x2 = attributes.x1;
             
          line.attr(attributes);
          
          //Change bar color with threshold movement
          d3.selectAll("rect")
            .attr("fill", function(d) {
              if (d.x <= upperLinePosition && d.x >= lowerLinePosition) {return includedColorScale(d.y);} 
              else if (d.x < lowerLinePosition && lowerLinePosition < upperLinePosition) {return excludedColorScale(d.y);}
              else if (d.x >= upperLinePosition && d.x >= lowerLinePosition && upperLinePosition < lowerLinePosition) {return includedColorScale(d.y);}
              else if (d.x <= upperLinePosition && lowerLinePosition > upperLinePosition) {return includedColorScale(d.y)}
              else {return excludedColorScale(d.y)}
            })
            .style("stroke", function(d) {
              if (d.x <= upperLinePosition && d.x >= lowerLinePosition) {return highlightColorScale(d.y);} 
              else if (d.x < lowerLinePosition && lowerLinePosition < upperLinePosition) {return includedColorScale(d.y);}
              else if (d.x >= upperLinePosition && d.x >= lowerLinePosition && upperLinePosition < lowerLinePosition) {return highlightColorScale(d.y);}
              else if (d.x <= upperLinePosition && lowerLinePosition > upperLinePosition) {return highlightColorScale(d.y)}
              else {return includedColorScale(d.y)}
            })        
            .style("stroke-width", "3px")                       
   
        updateLegend()
        
        //Update legend
        function updateLegend() {
              d3.selectAll('#legend').html("Max Threshold x: " + upperScaledPosition + "<br/>" + "Min Threshold x: " +  lowerScaledPosition);
        };   
        
    }
    
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
