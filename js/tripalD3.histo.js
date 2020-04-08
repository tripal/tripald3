/**
 * @file
 * Bar Chart functionality.
 */
tripalD3.histo = {

  var width = 960,
        height = 500,
        div = d3.select('body').append('div'),
        drag = d3.behavior.drag(),
        activeClassName = 'active-d3-item',
        lowColor = "#bceb65",
        highColor = "#9ed141";

      //Generate random data for histogram
      var randoNums = d3.range(5000).map(d3.random.normal());

      //Margin convention: DON'T TOUCH
      var margin = {
          top: 40,
          right: 40,
          bottom: 40,
          left: 40
        },
        width = 1000 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
      var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      //Find the closest X of the mouse
      var bisect = d3.bisector(function(d) {return d.x;}).left;

      //Get max and min of data for X axis
      var max = d3.max(randoNums),
        min = d3.min(randoNums);

      //Set X axis scale
      var x = d3.scale.linear()
        .domain([min, max])
        .range([0, width]);

      //Make a histogram layout with 30 bins
      var data = d3.layout.histogram()
        .bins(x.ticks(30))
        (randoNums);

      //Get max and min of histogram bins
      var yMax = d3.max(data, function(d) {return d.length}),
          yMin = d3.min(data, function(d) {return d.length});

      //Set Y axis scale
      var y = d3.scale.linear()
        .domain([0, yMax])
        .range([height, 0]);

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
        .data(data)
        .enter()
        .append("g")
        .attr("class", "column")
        .attr("transform", function(d) {
          return "translate(" + x(d.x) + "," + y(d.y) + ")";
        });


      //Draw the columns
      column.append("rect")
        .attr("x", 0)
        .attr("width", (x(data[0].dx) - x(0)) - 0.5)
        .attr("height", function(d) {
          return height - y(d.y);
        })
        .attr("fill", function(d) {
          return lowColorScale(d.y)
        });



      //Data for the threshold line
      var thresholdOrigin = [{
        'x1': 5,
        'y1': -50,
        'x2': 5,
        'y2': 425
      }];

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
        .origin(function(d) {
          return d;
        })
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
        var formatNumber = d3.format(",.0f");
        var formatter = function(d) {return formatNumber(d)};




        d3.selectAll("rect")
          .attr("fill", function(d) {
            if (d.x < linePosition) {
              return highColorScale(d.y);
            } else {
              return lowColorScale(d.y);
            }
          })

  

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

      //Make x axis
      var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

      //Draw x axis    
      svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
        
        
              var legend = svg.append("text")
       
          .attr("x", 820)
          .attr("y", 450)
          .text(function(d) {
            return ("x: " + formatter(linePosition));
          })
          .style("font-size", "15px")
          .style("fill", "red") .transition().style("opacity", 0)
