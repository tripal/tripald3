tripalD3.simpleScatter = {

    drawSimpleScatter: function(svg, data, options) {


        //get max 
        max = 0;
        for (let i =0; i < data.length; i++) {
          if (d3.max(data[i]) > max) {
                  max = d3.max(data[i])
          }
        }

        //get color
        var color = tripalD3.getColorScheme("categorical");
        


        //set xaxis scale
        var x = d3.scale.linear()
                .domain([0,max]) //swap with max of data
                .range([0, options.width]);


        //set yaxis scale
        var y = d3.scale.linear()
                .domain([0, max])
                .range([options.height-45, 0]) //num subtracted must be the same as xAxis subtracted

        //create xaxis
        var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom")
                .ticks(data.length +2);

        //create yaxis
        var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left");

        //append data points
         svg.selectAll("circle")
                 .data(data).enter()
                 .append("circle")
                 .attr("cx", function(d){return x(d[0])})
                 .attr("cy", function(d){return y(d[1])})
                 .attr("r", 5)
                 .attr("fill", function (d){return color[0]})
                 .attr("transform", "translate(20, 0)");
                 ;

        

        //Axes are tuned
        var xAxisTranslate = options.height-45;


        
        //append yaxis
        svg.append("g")
                .attr("class", "y axis")
                .attr("transform", "translate(20, 0)")
                .call(yAxis);

        //append xaxis to svg
        svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(20, " + xAxisTranslate  +")")
                .call(xAxis);

        
    },

    drawScatterHorizontal: function(svg, data, options) {

        //get max 
        max = 0;
        for (let i =0; i < data.length; i++) {
          if (d3.max(data[i]) > max) {
                  max = d3.max(data[i])
          }
        }
        var activeClassName = 'active-d3-item';


        //get color
        var color = tripalD3.getColorScheme("categorical");
        


        //set xaxis scale
        var x = d3.scale.linear()
                .domain([0,max]) //swap with max of data
                .range([0, options.width]);


        //set yaxis scale
        var y = d3.scale.linear()
                .domain([0, max])
                .range([options.height- 45, 0])

        //create xaxis
        var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom")
                .ticks(data.length +2);

        //create yaxis
        var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left");

        var thresholdOrigin = [
                {
                'x1': 5,
                'y1': 357,
                'x2': 955,
                'y2': 357
                }
        ];

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

        //append data points
         svg.selectAll("circle")
                 .data(data).enter()
                 .append("circle")
                 .attr("cx", function(d){return x(d[0])})
                 .attr("cy", function(d){return y(d[1])})
                 .attr("fill", function (d){return color[0]})
                 .attr("transform", "translate(20, 0)")
                 .attr("r", 5)
                 ;


            //begin drag code
        var drag = d3.behavior.drag()
                .origin(function(d) { return d; })
                .on('dragstart', dragstarted)
                .on('drag', dragged)
                .on('dragend', dragended);

        
        var lines = svg
                .selectAll('line')
                .data(thresholdOrigin)
                .enter()
                .append('line')
                        .attr(lineAttributes)
                        .call(drag);

        function dragstarted() {
                d3.select(this).classed(activeClassName, true);
        }

        function dragged() {
		var lineScale = d3.scale.linear().domain([0, options.height]).range([10, 0]);
                var linePosition = lineScale(lines.attr("y2"));
                var y = d3.event.dy;
    
                var line = d3.select(this);

    
                var attributes = {
                 x1: parseInt(line.attr('x1')),
                 y1: parseInt(line.attr('y1'))+y,

                 x2: parseInt(line.attr('x2')),
                 y2: parseInt(line.attr('y2'))+y,
        };
  
    line.attr(attributes);
    
    d3.selectAll("circle")
    	.attr("fill", function(d) {
      console.log(d);
      if (d[1] <=linePosition) {
      	return color[0]
      } else {
      	return color[1] 
      }
      });
      
      
      
 }

        function dragended() {
                d3.select(this).classed(activeClassName, false);
        }

        

        //Axes are tuned
        //-45 prevents x axis from overlaping with text below
        var xAxisTranslate = options.height-45;


        
        //append yaxis
        svg.append("g")
                .attr("class", "y axis")
                .attr("transform", "translate(20, 0)")
                .call(yAxis);

        //append xaxis to svg
        svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(20, " + xAxisTranslate  +")")
                .call(xAxis);

    }
};
