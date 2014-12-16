/**
 * A collection of biological diagrams created using d3.js and encapsulated
 * for easy use.
 */
bioD3 = {
  'version': '0.1-dev',

    /**
     * Pedigree Tree
     *
     * @param options
     *   A javascript object with any of the following keys:
     *    - dataJSONpath: (REQUIRED) The path to the JSON array providing data
     *        for this pedigree.
     *    - elementId : The ID of the HTML element the diagram should be attached to.
     *    - margin: an object with 'top', 'right','bottom','left' keys. Values
     *        are in pixels and all four keys must be set.
     *    - width: The width of the diagram.
     *    - height: The height of the diagram.
     *    - collapseDuration: The duration of the transition effect used to
     *        collapse the tree.
     *    - nodeFillCollapsed: The fill color of the node when it's subtree is collapsed.
     *    - nodeFill: The color of the node when it is fully expanded.
     *    - backgroundColor: The color of the background of the diagram. This
     *        is used to add the transparent backing to labels.
     */
    drawPedigreeTree: function(options) {

      // Set Defaults.
      if (!options.hasOwnProperty('elementId')) {
        options.elementId = 'tree';
      }
      if (!options.hasOwnProperty('margin')) {
        options.margin = {
            'top': 50,
            'right': 0,
            'bottom': 50,
            'left': 0
        };
      }
      if (!options.hasOwnProperty('width')) {
        options.width = document.getElementById(options.elementId).offsetWidth;
      }
      if (!options.hasOwnProperty('height')) {
        options.height = document.getElementById(options.elementId).offsetHeight;
      }
      if (!options.hasOwnProperty('collapseDuration')) {
        options.collapseDuration = 750;
      }
      if (!options.hasOwnProperty('nodeFillCollapsed')) {
        options.nodeFillCollapsed = '#B3B3B3';
      }
      if (!options.hasOwnProperty('nodeFill')) {
        options.nodeFill = '#FFF';
      }
      if (!options.hasOwnProperty('backgroundColor')) {
        options.backgroundColor = '#FFF';
      }
      if (!options.hasOwnProperty('key')) {
        options.key = {};
      }

      // Set up drawing area dimensions.
      var margin = options.margin,
      width = options.width - margin.right - margin.left,
      height = options.height - margin.top - margin.bottom;

      // Used to generate unique ids for the nodes.
      var i = 0;

      // Initialize the tree.
      var tree = d3.layout.tree()
          .size([width, height]);

      // Append our drawing area to the id="tree" element.
      var svg = d3.select("#tree").append("svg")
          .attr("width", options.width)
          .attr("height", options.height)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // Retrieve data.
      d3.json(options.dataJSONpath, function(error, treeData) {

        // Declare the root.
        root = treeData[0];

        // Call the function to actually draw the tree.
        drawTree(root);
      });

      /**
       * Function used to draw the tree. We use a function to allow
       * us to reuse code when re-drawing after click events.
       *
       * @param source
       *   The root of the tree which includes the definition
       *   of the entire tree to be drawn.
       */
      function drawTree(source) {

          // Keep track of the types of edges and nodes to display them
          // later in a legend/key.
          var keyData = [];

          // Compute the new tree layout
          // and the parent-child links between nodes.
          // NOTE: This computes x,y on an arbitray coordinate system.
          var nodes = tree.nodes(root).reverse(),
              links = tree.links(nodes);

          // Normalize for fixed-depth
          // and determin the max depth while you're at it
          // for use in flipping the tree to be bottom rooted.
          var maxDepth = 0;
          nodes.forEach(function (d) {
              d.y = d.depth * 75;
              if (d.depth > maxDepth) {
                  maxDepth = d.depth;
              }
          });
          var offset = maxDepth * 75;

          // Flip the tree to be bottom rooted. (Default top rooted)
          // This is done by multiplying the y coord by -1 to flip
          // the tree on the cartesian plane. Then to pull it back
          // onto the canvas we apply the offset calculated above.
          nodes.forEach(function (d) {
              d.y = -d.y + offset;
          });

          // Select all the tree nodes into an array
          // and add a calculated id.
          var node = svg.selectAll("g.node")
              .data(nodes, function (d) {
              return d.id || (d.id = ++i);
          });

          // Create the node elements
          // wrapping them in <g class="node"></g>
          // and moving them into the correct positions using the
          // canvas transform() function.
          var nodeEnter = node.enter().append("g")
              .attr("class", "node")
              .attr("transform", function (d) {
                if (source.x0 || source.y0) {
                  return "translate(" + source.x0 + "," + source.y0 + ")";
                } else {
                  return "translate(" + source.x + "," + source.y + ")";
                }
              })
              // Specify that on clicking of the node,
              // call the "click" function.
              .on("click", click);

          // Draw a circle to denote the node.
          nodeEnter.append("circle")
          .attr("r", 6)
          .style("fill", function(d) { return d._children ? options.nodeFillCollapsed : options.nodeFill; });

          // Add nodes to the key.
          keyData.push({
            'classes' : ['expanded'],
            'groupClasses': ['node'],
            'type': 'circle',
            'label': 'Germplasm Node (Pedigree shown)',
            'fillColor': '#FFF'
          });
          keyData.push({
            'classes': ['collapsed'],
            'groupClasses': ['node'],
            'type': 'circle',
            'label': 'Germplasm Node (Pedigree hidden)',
            'fillColor': '#B3B3B3'
          });

          // Draw a rectangle the same colour as the background
          // to ensure the label added next will be readable.
          nodeEnter.append("rect")
          .attr("width", 30)
          .attr("height", 12)
          .attr("x", -15)
          .attr("y", function(d) {
                  return d.children || d._children ? 8 : -20; })
          .style("fill", options.backgroundColor)
          .style("opacity",0.9);

          // Draw the node label.
          nodeEnter.append("text")
              .attr("y", function(d) {
                  return d.children || d._children ? 14 : -14; })
              .attr("dy", ".35em")
              .attr("text-anchor", "middle")
              .text(function (d) {
                  return d.name;
              })
              .style("fill-opacity", 1);

          // Transition nodes to their new position.
          var nodeUpdate = node.transition()
              .duration(options.collapseDuration)
              .attr("transform", function(d) {
                  return "translate(" + d.x + "," + d.y + ")"; });

          // Update the circle color to indicate the node is collapsed.
          nodeUpdate.select("circle")
              .style("fill", function(d) {
                  return d._children ? options.nodeFillCollapsed : options.nodeFill; });

          // Transition exiting nodes to the parent's new position
          // and then remove them.
          var nodeExit = node.exit().transition()
              .duration(options.collapseDuration)
              .attr("transform", function(d) {
                  return "translate(" + source.x + "," + source.y + ")";
                })
              .remove();

          // Shrink the size of the exiting circle.
          nodeExit.select("circle")
              .attr("r", 1e-6);

          // Fade the exiting text.
          nodeExit.select("text")
              .style("fill-opacity", 1e-6);

          // Initialize the connecting lines function.
          // d3.svg.diagonal() generates a cubic Bézier connecting the
          // source (parent) and target (child) points.
          // .projection specifies the ??location?? of the links.
          var diagonal = d3.svg.diagonal()
              .projection(function (d) {
                  return [d.x, d.y];
              });

          // Select all the connecting lines into an array
          // of child ids for each child => parent link.
          var link = svg.selectAll("path.tree-link")
          .data(links, function (d) {
                  return d.target.id;
              });

          // Keep track of unique set of relationships for the key.
          var relTypes = {};

          // Create the connecting path elements
          // wrapping them in <g class="node"></g>
          // and drawing them using the "diagonal" path function
          // (function defined previously)
          link.enter().insert("path", "g")
              .attr("class", "link tree-link")
              .attr("class", function (d) {
                  var type = d.target.relationship.type.replace(/\s+/g, '-').toLowerCase();
                  type = type.replace(/_/g, '-').toLowerCase();
                  relTypes[type] = type;
                  return "link tree-link " + type;
              })
              .attr("d", function(d) {
                if (source.x0 || source.y0) {
                  var o = {x: source.x0, y: source.y0};
                } else {
                  var o = {x: source.x, y: source.y};
                }
                return diagonal({source: o, target: o});
              });

          // Add unique edge types to the key.
          for (var type in relTypes) {
            keyData.push({
              'classes': ['link', type],
              'type': 'path',
              'label': type.replace(/-/g, ' ')
            });
          }

          // Transition links to their new position.
          link.transition()
            .duration(options.collapseDuration)
            .attr("d", diagonal);

          // Transition exiting nodes to the parent's new position.
          link.exit().transition()
              .duration(options.collapseDuration)
            .attr("d", function(d) {
              var o = {x: source.x, y: source.y};
              return diagonal({source: o, target: o});
            })
            .remove();

          // Add tooltips to the connecting lines to make sure it's
          // clear what the relationship is.
          var tooltips= d3.selectAll("path.tree-link")
            .html(function(d,i) {
                return '<title class="tooltip">' + d.target.relationship.subject + ' ' + d.target.relationship.type + ' ' + d.target.relationship.object + '</title>';
              });

          // Stash the old positions for transition.
          nodes.forEach(function(d) {
            d.x0 = d.x;
            d.y0 = d.y;
          });

          // Change the size to match the new tree.
          d3.select("#tree svg").transition()
            .duration(options.collapseDuration)
            .style('height', offset + margin.top + margin.bottom);

          // Draw the key.
          bioD3.drawKey(keyData, options.key);
      }

      /**
       * Handles the clicking of nodes to collapse them.
       */
      function click(d) {
          // Essentially, since the drawTree() function looks for
          // children at node.children, this function empties that
          // array, moving it's contents into node._children. Thus when
          // drawTree() is called, it doesn't find any children to draw,
          // effectively collapsing it.
          if (d.children) {
              d._children = d.children;
              d.children = null;
          // If there is already no children then it looks to see if the
          // node._children array exists (signalling this node was
          // already collapsed) and moves it back to node.children,
          // effectively uncollapsing the node.
          } else {
              d.children = d._children;
              d._children = null;
          }
          drawTree(d);
      }
  },

  /**
   * Draws a graphical key on an existing diagram to explain the colours
   * and styles used.
   *
   * @param data
   *   An array of key items where each item is an object with the following keys:
   *    - classes: the classes attached to the item represented.
   * @param $options
   *   A javascript object with any of the following keys:
   */
  drawKey: function(data, options) {

    if (d3.select("#legend svg").empty()) {
      // Set defaults.
      if (!options.hasOwnProperty('elementId')) {
        options.elementId = 'legend';
      }
      if (!options.hasOwnProperty('margin')) {
        options.margin = {
            'top': 10,
            'right': 0,
            'bottom': 10,
            'left': 0
        };
      }
      if (!options.hasOwnProperty('width')) {
        options.width = document.getElementById(options.elementId).offsetWidth;
      }
      if (!options.hasOwnProperty('height')) {
        options.height = data.length * 18;
      } else if (options.height == 'auto') {
        options.height = document.getElementById(options.elementId).offsetHeight;
      }

      var width = options.width - options.margin.right - options.margin.left,
      height = options.height - options.margin.top - options.margin.bottom;

      var legendSpacing = 18;

      // Create canvas to draw the key on.
      var svg = d3.select('#legend')
        .append('svg')
        .attr('width', options.width)
        .attr('height', options.height)
        .append('g')
        .attr("transform", "translate(" + options.margin.left + "," + options.margin.top + ")");

      // Now for each item in the data array, create a g legend-item
      // and move it to where we want each member of the lengend to go.
      var legendItems = svg.selectAll('.legend-item')
        .data(data)
        .enter()
        .append('g')
        .attr('class', function(d) {
          if (d.groupClasses) {
            return 'legend-item ' + d.type + ' ' + d.groupClasses.join(' ');
          } else {
            return 'legend-item ' + d.type;
          }
        })
        .attr('transform', function(d, i) {
          var horz = 0;
          var vert = i * legendSpacing;
          return 'translate(' + horz + ',' + vert + ')';
        });

      // Draw any lines:
      //---------------------------------
      // Define a function to draw the line.
      var lineFunction = d3.svg.line()
        .x(function(d) { return d.x; })
        .y(function(d) { return d.y; })
        .interpolate("linear");

      // For each legend-item of type path, add a path element with the
      // classes specified in data and a length similar to the lines
      // drawn in the diagram.
      var lineLegendItems = svg.selectAll('.legend-item.path');

      lineLegendItems.append('path')
        .attr('class', function( i, val ) {
          return i.classes.join(' ');
        })
        .attr("d", function(d) {
          // Draw a line 60px long.
          return lineFunction([{x:0, y:0},{x:55, y:0}]);
        });

      // Draw any circles:
      //---------------------------------
      // For each legend-item of type circle, add a circle element with the
      // classes specified in data.
      var circleLegendItems = svg.selectAll('.legend-item.circle');

      circleLegendItems.append('circle')
        .attr("r", 6)
        .attr('class', function( i, val ) {
          return i.classes.join(' ');
        })
        .style("fill", function(d) { return d.fillColor; })
        .attr('transform','translate(27,0)');

      // Add the labels for each item:
      //---------------------------------
      legendItems.append('text')
        .attr('x', 70)
        .attr('y', 4)
        .text(function(d) { return d.label; });
    }
  }
};