/**
 * @file
 * Histogram functionality.
 */

tripalD3.histogram = {

  
//Generate random data
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
    

//Get max and min of data for X axis
var max = d3.max(randoNums);
var min = d3.min(randoNums);

//Set X axis scale
var x = d3.scale.linear()
      .domain([min, max])
      .range([0, width]);

//Make a histogram layout with 30 bins
var data = d3.layout.histogram()
    .bins(x.ticks(30))
    (randoNums);

//Get max and min of histogram bins
var yMax = d3.max(data, function(d){return d.length});
var yMin = d3.min(data, function(d){return d.length});

//Set Y axis scale
var y = d3.scale.linear()
    .domain([0, yMax])
    .range([height, 0]);

//Make the bars
var bar = svg.selectAll(".bar")
    .data(data)
  .enter().append("g")
    .attr("class", "bar")
    .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

//Draw the bars
bar.append("rect")
    .attr("x", 0)
    .attr("width", (x(data[0].dx) - x(0)) - 0.5)
    .attr("height", function(d) { return height - y(d.y); })
    .attr("fill", "darkolivegreen");
    

}
