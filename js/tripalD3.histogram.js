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
    
    radius = 20;
var circle_data = d3.range(50).map(function() {
    return{
        x : Math.round(Math.random() * (width - radius * 2 ) + radius),
        y : Math.round(Math.random() * (height - radius * 2 ) + radius)
    }; 
}); 
    
    var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

   var circles = d3.select("svg")
	.append("g")
	.attr("class", "circles")
	.selectAll("circle")
        .data(circle_data)
        .enter()
        .append("circle")
        .attr("cx", function(d) {return(d.x)})
        .attr("cy", function(d) {return(d.y)})
        .attr("r", radius)
        .attr("fill", "green");
};
