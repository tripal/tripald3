/**
 * @file
 * Bar Chart functionality.
 */
tripalD3.histo = {

  /**
   * Draw a simple bar chart.
   *
   * @param svg
   *   The canvas to draw the pie chart on.
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
      .ticks(5)
      .outerTickSize(1);
    
    var width = 960,
    height = 500,
    div = d3.select('body').append('div'),
    drag = d3.behavior.drag(),
    activeClassName = 'active-d3-item',
    lowColor = "#63f5ff",
    highColor = "#24bbed";
   
//Generate random data for histogram
var randoNums = d3.range(5000).map(d3.random.normal());

//Margin convention: DON'T TOUCH
var margin = {top: 40, right: 40, bottom: 40, left: 40},
    width = 1000 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

   // This allows to find the closest X index of the mouse:
 var bisect = d3.bisector(function(d) { return d.x; }).left;  
 

//Get max and min of data for X axis
var max = d3.max(randoNums),
 min = d3.min(randoNums);

//Set X axis scale
var x = d3.scale.linear()
      .domain([min, max])
      .range([0, width]);
     
// --- % % % --- Make a histogram layout with 30 bins --- % % % ---
var data = d3.layout.histogram()
    .bins(x.ticks(30))
    (randoNums);  
   
//Get max and min of histogram bins
var yMax = d3.max(data, function(d){return d.length}),
    yMin = d3.min(data, function(d){return d.length});
   
//Set Y axis scale
var y = d3.scale.linear()
    .domain([0, yMax])
    .range([height, 0]);    

var highColorScale = d3.scale.linear()
            .domain([yMin, yMax])
            .range([d3.rgb(highColor).brighter(), d3.rgb(highColor).darker()]);
           
var lowColorScale = d3.scale.linear()
.domain([yMin, yMax])
            .range([d3.rgb(lowColor).brighter(), d3.rgb(lowColor).darker()]);
           
           
//Make the columns
var column = svg.selectAll(".column")
    .data(data)
  .enter().append("g")
    .attr("class", "column")
    .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });
           
           
 //Draw the columns
column.append("rect")
    .attr("x", 0)
    .attr("width", (x(data[0].dx) - x(0)) - 0.5)
    .attr("height", function(d) { return height - y(d.y); })
    .attr("fill", function(d){ return lowColorScale(d.y)});
   
 

//Data for the threshold line
var thresholdOrigin = [
  {
    'x1': 5,
    'y1': -50,
    'x2': 5,
    'y2': 425
  },  
];

// Generate the svg lines attributes
var lineAttributes = {
    'x1': function(d) {
        return d.x1;
    },
    'y1': function(d) {
        return d.y1;
    },
    'x2': function(d) {
        return d.x2;
    },
    'y2': function(d) {
        return d.y2;
    }
};

//Drag behavior for threshold line
var drag = d3.behavior.drag()
  .origin(function(d) { return d; })
  .on('dragstart', dragstarted)
  .on('drag', dragged)
  .on('dragend', dragended);

// Pointer to the d3 lines
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
    var width = max - min;
    var ration = 920 / width;
    var offset = width / 2;
    var linePosition = ((lines.attr("x2") / ration) - offset);
    var legendText = legend.append(function(d) {return ("")});
    
    legendText.text(function(d) {return ("")})
    .attr("class", "legendText absolute")
 
   
     d3.selectAll("rect")
    .attr("fill", function(d) {
    if (d.x < linePosition) {
      return highColorScale(d.y);
    } else {
      return lowColorScale(d.y);
    }})
   
  
 
  

   
// Update threshold line properties after drag event
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
d3.select(this)
.classed(activeClassName, false)
   };

//Get max and min of data for X axis
var max = d3.max(randoNums),
 min = d3.min(randoNums);

//Set X axis scale
var x = d3.scale.linear()
      .domain([min, max])
      .range([0, width]);
    
    //Set Y axis scale
var y = d3.scale.linear()
    .domain([0, yMax])
    .range([height, 0]);   
    
    //Make x axis
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");
   
 //Draw x axis    
    svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);
   
/**

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
      .attr("x", -8)
      .attr("y", 2);
    // Make the ticks actually visible ;-).
    svg.selectAll(".axis .tick line")
      .style("stroke", "black")
      .style("stroke-width", "1px")
      .style("shape-rendering", "crispEdges");
*/
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
