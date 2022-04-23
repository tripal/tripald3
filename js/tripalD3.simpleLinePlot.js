//need to use options variable in places
tripalD3.simpleLinePlot = {

    drawSimpleLinePlot: function(svg, data, options){

        /*
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
          */

        var drag = d3.behavior.drag(),
        activeClassName = 'active-d3-item';
        
            
        
        //creating axes
        var xAxis = d3.scale.linear()
                        .domain([0, d3.max(data, function(d){ return +d.x})])
                        .range([0, options.width]);
       
       var yAxis = d3.scale.linear()
                        .domain([0, d3.max(data, function(d) { return +d.y; })])
                        .range([options.height-45, 0]);
            
        //minimum and max y
        var yMax = d3.max(data, function(d) {return d.y});
            
        var yMin = d3.min(data, function(d) {return d.y});
                  
        var y = d3.scale.linear()
                        .domain([0, yMax])
                        .range([options.height, 0]);
          
            
         var x = d3.scale.linear()
                .domain([0, 100])
                .range([0, options.width]);
          
        
        var xAxisTranslate = options.height-45;
        
        //Make x axis
        var xAx = d3.svg.axis()
                    .scale(xAxis)
                    .orient("bottom");
              
        //draw x axis
        svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(20," + xAxisTranslate + ")")
        .call(xAx);
                
         
        //Make y axis
        var yAx = d3.svg.axis()
            .scale(yAxis)
            .orient("left");
              
        //draw y axis
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(20, 0)")
            .call(yAx);
        
        // variables to make sure dots and 
        // the line are in the same place on screen
        var xPlace = 2;
        var yPlace = 13;


        //get color
        var color = tripalD3.getColorScheme("categorical");

        // adding dots
        svg.append('g')
            .selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            // specifies the horizontal position of the circle
            .attr("cx", function (d) { return x(d.x); })
            // specifies the vertical position of the circle
            .attr("cy", function (d) { return y(d.y); })
            // specifies radius of the circle
            .attr("r", 5)
            // translate all data points to match the translation of 
            // axes. first number moves dots along x plane.
            // higher second number moves dots down on page.
            .attr("transform", "translate(" + xPlace + "," + yPlace + ")")
            //color code
            .attr("fill", function (d){return color[5]})
            .attr("class", "dots")
            ;
           
        
        /*
        Data for the threshold line
                 
        controlling the x1 and x2 vars will allow you
        to move the whole line anywhere you want
        */
       
        var thresholdOrigin = [{
            //controls angle of line from the top.
            //smaller number tilts it leftward.
            'x1': 30,
            // controls how tall line is (y-axis size).
            // smaller number means taller line
            'y1': -50,
            // controls angle of line from the bottom.
            // smaller number tilts it leftward
            'x2': 30,
            // controls up and down position.
            // smaller number moves it up
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
                
                
        // draggabale line
        var line1 = svg
            .data(thresholdOrigin)
            .append('line')
            .attr(lineAttributes)
            .style("stroke", "blue")
            .call(drag);
                
          
        //Start drag function
        function dragstarted() {
            d3.select(this).classed(activeClassName, true);
        }
              
              
        //Drag function
        function dragged() {
            //domain([0, width]).range([min,max])
            var lineScale = d3.scale.linear().domain([0, options.width]).range([0, 100]);
            var linePosition = lineScale(line1.attr("x2"));
            var x = d3.event.dx;
            var y = d3.event.dy;
            var line = d3.select(line1);
                
            // Update threshold line properties after drag event
            var attributes = {
                x1: parseInt(line1.attr('x1')) + x,
                y1: parseInt(line1.attr('y1')),
        
                x2: parseInt(line1.attr('x2')) + x,
                y2: parseInt(line1.attr('y2')),
            };
        
            line1.attr(attributes);
                
            //console.log('x1: ' + line1.attr('x1'));
            //console.log('y1: ' + line1.attr('y1'));
            //console.log('x2: ' + line1.attr('x2'));
            //console.log('y2: ' + line1.attr('y2'));
            
            d3.selectAll(".dots")
            .attr("fill", function(d) {
            
                if (d.x <=(linePosition)) {
                    return color[5]
                } else {
                  return color[0] 
                }
            });
                
        }//End drag function
        
                 
        function dragended() {
            d3.select(this)
            .classed(activeClassName, false)
        };         
    
        
        
        //connecting dots and drawing line
        var line2 = d3.svg.line()
        // insert values from data into a line form,	
        // d.x goes into data and gets x values
        .x(function(d) { return x(d.x); })
        .y(function(d) { return y(d.y); })
        
        // giving svg a path so that it can draw the line
        svg.append("path")
        .datum(data)
        //adujust where line is placed
        .attr("transform", "translate(" + xPlace + "," + yPlace + ")")
        .attr("d", line2)
        .style("fill", "none")
        .style("stroke", "#CC0000")
        .style("stroke-width", "2");
        
    }// 

} // end of tripald3....