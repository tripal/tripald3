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

      // Start the throbber going to provide progress.
      var throbber = bioD3.ellipsisThrobber(svg, {'left':options.width/2, 'top':50});

      // Retrieve data.
      var treeData = d3.json(options.dataJSONpath)
        .on("error", function(error) { console.log('failure!'); })
        .get(function(error, treeData) {

          // Remove throbber.
          throbber.remove();

          // Only attempt to draw the tree if the JSON was returned properly.
          if (treeData) {
            // Draw tree.
            root = treeData[0];
            drawTree(root);

            // Register resize of tree if config is set.
            if (Drupal.settings.tripalD3.autoResize) {
              resizeTree();
            }
          } else {

            // Remove throbber & canvas
            d3.select('#tree svg')
              .remove();

            // Report a regular drupal_set_message.
            var errorDiv = d3.select("#tree")
              .append('div')
              .attr('class', 'messages error');

            errorDiv.append('h2')
              .classed('element-invisible', true)
              .html('Error Messages');

            var errorList = errorDiv.append('ul');

            errorList.append('li')
              .html('Unable to retrieve tree data. This might be due to a circular relationship within your tree. If not, tell your administrator to check that the JSON callback is able to retrieve data for this stock/germplasm.');

            // Remove legend and tree description.
            d3.select('.tree-legend')
              .remove();

            d3.select('.tree-description')
              .remove();
          }

        });

      /**
       * Resize the tree when the window size changes
       */
      function resizeTree() {
        window.addEventListener('resize', function() {
          d3.select("#tree svg").remove();

          width = document.getElementById(options.elementId).offsetWidth;
          height = document.getElementById(options.elementId).offsetHeight;

          // Initialize the tree.
          tree = d3.layout.tree()
              .size([
                width - margin.right - margin.left,
                height - margin.top - margin.bottom
              ]);

          // Append our drawing area to the id="tree" element.
          svg = d3.select("#tree").append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          drawTree(root);
        });
      }

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


          tree = tree.size([width, height]);

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
              .attr("class", "node tree-node")
              .attr("transform", function (d) {
                if (source.x0 || source.y0) {
                  return "translate(" + source.x0 + "," + source.y0 + ")";
                } else {
                  return "translate(" + source.x + "," + source.y + ")";
                }
              })
              // Specify that on clicking of the node,
              // call the "click" function.
              .on("dblclick", collapse);


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

          // Add labels to the node.
          // NOTE: this has to be done using each so that we can determine
          //   which ones have urls associated with them and thus are "linkable"
          //   and which do not, since we have to treat them differently.
          nodeEnter.each(function(d,i) {
            d.current.label = {
              'url': options.nodeURL(d),
              'text': d.current.name
            };

            // If the current node is linkable then add a link around the label.
            if (d.current.label.url) {

              d3.select(this)
                .classed('linkable', true)
                .append('a')
                  .attr('xlink:href', function(d) { return d.current.label.url; })
                  .attr('target','_blank')
                .append("text")
                  .attr("y", function(d) {
                      return d.children || d._children ? 14 : -14; })
                  .attr("dy", ".35em")
                  .attr("text-anchor", "middle")
                  .text(function (d) { return d.current.label.text; })
                  .style("fill-opacity", 1);
            // Otherwise just add the text.
            } else {

              d3.select(this)
                .classed('text-only', true)
                .append("text")
                  .attr("y", function(d) {
                      return d.children || d._children ? 14 : -14; })
                  .attr("dy", ".35em")
                  .attr("text-anchor", "middle")
                  .text(function (d) { return d.current.label.text; })
                  .style("fill-opacity", 1);
            }
          });

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

          var typeNum = 0;
          var colorSchemeId = Drupal.settings.tripalD3.colorSchemes.selected;
          var colors = Drupal.settings.tripalD3.colorSchemes[colorSchemeId].categorical;
          for (var type in relTypes) {

            // Add unique edge types to the key.
            keyData.push({
              'classes': ['link', type],
              'type': 'path',
              'label': type.replace(/-/g, ' '),
              'stroke': colors[typeNum]
            });

            // Color the links based on the type.
            // Color scheme can be set in the Drupal config for this module.
            svg.selectAll('path.tree-link.' + type)
              .attr('stroke', function (d) { return colors[typeNum]; });

              typeNum = typeNum + 1;
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
            .append('title')
              .text(function(d,i) {
                return d.target.relationship.subject + ' ' + d.target.relationship.type + ' ' + d.target.relationship.object;
              });

          // Stash the old positions for transition.
          nodes.forEach(function(d) {
            d.x0 = d.x;
            d.y0 = d.y;
          });

          // Change the size to match the new tree.
          d3.select("#tree svg").transition()
            .duration(options.collapseDuration)
            .attr('height', offset + margin.top + margin.bottom);

          // Draw the key.
          bioD3.drawKey(keyData, options.key);

      }

      /**
       * Handles the clicking of nodes to collapse them.
       */
      function collapse(d) {
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
        options.width = '100%';//document.getElementById(options.elementId).offsetWidth;
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
        })
        .attr('stroke', function(d) { return d.stroke; });

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
  },

  /**
   * Provides an infinite progress throbber in the form of an Ellipsis
   *
   * USE: this function returns the throbber so simple use .remove()
   * throbber = ellipsisThrobber(svg, {'left':50, 'top':50});
   * setTimeout(function(){ throbber.remove() }, 3000);
   *
   * @param svg
   *   The svg canvas to draw the throbber on.
   * @param dimensions
   *   An object specifying the left and top coordinates for the center
   *   of the throbber.
   * @return
   *   The D3.js throbber object
   */
  ellipsisThrobber: function(svg, dimensions) {

    var radius = 8,
      color = 'black';

    var circleData = [
      {
        'cx': -25,
        'i': 0,
        'n': 1
      },
      {
        'cx': 0,
        'i': 1,
        'n': 1
      },
      {
        'cx': 25,
        'i': 2,
        'n': 1
      }
    ];

    var meter = svg.append("g")
        .attr("class", "progress-meter")
        .attr("transform", "translate(" + dimensions.left + "," + dimensions.top + ")");

    var circles = meter.selectAll('circle')
      .data(circleData)
        .enter()
      .append('circle')
        .attr('cx', function(d) { return d.cx; })
        .attr('cy', 15)
        .attr('r', radius)
        .attr('fill',color)
        .attr('opacity', 0.5)
    .transition()
      .duration(500)
      .delay(function(d) { return d.i * 200; })
      .each(fade);

    function fade() {
      var circle = d3.select(this);
      (function repeat() {
        circle = circle.transition()
            .attr('opacity', function(d) {

                if (d.n == 0) {
                  d.n = 1;
                  return 0.05;
                } else {
                  d.n = 0;
                  return 1;
                }
              })
            .each("end", repeat);
      })();
    }

    return meter;

  },

  /**
   * Add information popovers to any set of elements in a D3 diagram.
   *
   * @TODO: support top, left, right popovers and ensure the correct orientation is used
   *   to ensure the popover is always on the screen.
   * @TODO: a default function needs to be set for options.popoverContent function.
   *
   * @param options
   *   A javascript object with any of the following keys:
   *    - diagramId: the ID of the element containing the svg diagram to attach
   *      the popovers to.
   */
  popover: function(options) {

    var popoverId = 'popover1';

    // Find our svg canvas
    var svg = d3.select('#' + options.diagramId + ' svg');

    var node = null;

    // If the popover HTML elements already exist then just select them
    // using d3 and otherwise create them for future use.
    var popoverContainer = svg.select('#' + popoverId + '-container');
    var popover = popoverContainer.select('#' + popoverId);
    var popoverSelected = false;
    if (!document.getElementById(popoverId + '-container')) {
      popoverContainer = svg.append('g')
          .attr('id', popoverId + '-container')
          .classed('popover-container', true)
          .attr("transform", "translate(" + options.margin.left + "," + options.margin.top + ")");

      popover = popoverContainer.append('g')
          .attr('id', popoverId)
          .classed('popover', true)
          .style('opacity',0);
    }

    /**
     * Toggle the visibility fo the popover.
     */
    popover.toggle = function(d) {
      popoverContent =  popover.selectAll("*");
      if (popoverContent.empty()) {
        popover.show(d);
      }
      else if (d != node) {
        popover.show(d);
      }
      else {
        popoverContent.remove();
      }
    }

    /**
     * Show the popover for a given node (d)
     */
    popover.show = function(d) {

      popover.selectAll("*").remove();

      // Save the node for later.
      node = d;

      // Settings:
      var orientation = 'bottom',
          arrowLength = 15;
      popover.left = d.x0 - (150/2);
      popover.top = d.y0 + 6 + arrowLength;

      // Helper Functions:
      // Draw Triangle.
      var triangleFunction = function(topPoint, bottomY, hypLen) {
        var lineFunction = d3.svg.line()
          .x(function(d) { return d.x; })
          .y(function(d) { return d.y; })
          .interpolate("linear");
        return lineFunction([
          {'x': topPoint.x + hypLen, 'y': bottomY + 1}, // Draw right side of triangle.
          {'x': topPoint.x, 'y': topPoint.y + 6},   // Move to the center of the node.
          {'x': topPoint.x - hypLen, 'y': bottomY + 1},  // Draw left side of triangle.
        ]);
      };
      // Draw header rectangle with top rounded corners.
      var headerRectFunction = function(x, y, width, height, radius) {
        return "M" + x + "," + (y + height) // bottom left.
         + "v" + -(height - radius) // left side.
         + "a" + radius + "," + radius + " 0 0 1 " + radius + "," + -radius // left corner.
         + "h" + (width - 2 * radius) // top.
         + "a" + radius + "," + radius + " 0 0 1 " + radius + "," + radius //right corner.
         + "v" + (height - radius) // right side.
         + "z";
      };
      // Draw body rectangle with bottom rounded corners.
      var bodyRectFunction = function(x, y, width, height, radius) {
        return "M" + x + "," + y // top left.
         + "v" + (height - radius) // left side.
         + "a" + radius + "," + radius + " 0 0 0 " + radius + "," + radius // left corner.
         + "h" + (width - 2 * radius) // bottom.
         + "a" + radius + "," + radius + " 0 0 0 " + radius + "," + -radius //right corner.
         + "v" + -(height - radius) // right side.
         + "z";
      };

      // Draw the popover:
      //    - header.
      var popoverHeader = popover.append('path')
        .attr('id', 'popover1-header')
        .classed('popover-box', true)
        .attr("d", headerRectFunction(popover.left, popover.top, 150-2, 25, 7))
        .attr('fill', '#F5F5F5')
        .attr('stroke','#B3B3B3');
      //    - body.
      var popoverBody = popover.append('path')
        .attr('id', 'popover1-body')
        .classed('popover-box', true)
        .attr("d", bodyRectFunction(popover.left, popover.top + 25, 150-2, 75, 7))
        .attr('fill', '#FFF')
        .attr('stroke','#B3B3B3');
      //    - arrow pointing to node.
      popover.append('path')
        .classed('popover-box', true)
        .attr("d", triangleFunction(d, popover.top, arrowLength))
        .attr('fill', function(d) {
            if (orientation == 'bottom') { return '#F5F5F5';
            } else { return '#FFF';
          }})
        .attr('stroke','#B3B3B3');

      // Add the content to the popover.
      //    - Header
      popover.append("text")
        .attr('text-anchor', 'middle')
        .attr('dy', '0.4em')
        .attr('font-size', '15')
        .attr('x', popover.left + 150/2)
        .attr('y', popover.top + 25/2)
        .text(d.current.name);
      //    - Body
      options.popoverContent(popover, d);

      // make it visible.
      popover.transition()
        .duration(300)
        .style('opacity',1);
    };

    /**
     * Hide the popover for a given node (d).
     */
    popover.hide = function (d) {
      setTimeout(function(d) {
        if (popoverSelected == false) {
          popover.selectAll("*").remove();
          popover.style('opacity',0);
        }
      }, 700);
    };

    return popover;
  },

  /**
   * Allow for consistent cross-diagram color schemes
   */
  colorSchemes: function(schemeName, type) {
    var schemes = {
      GrBuRr: {
        quantitative: ['#008F09','#00E60F','#80FE89',     '#B69500','#FFD100','#FFE881',     '#20057D','#3C0EDB','#A88FFE',     '#B62300','#FF3100','#FF9981'],
        categorical: ['#00E60F','#FFD100','#3C0EDB','#FF3100',        '#008F09','#B69500','#20057D','#B62300',        '#80FE89','#FFE881','#A88FFE','#FF9981']
      },
      RdBl: {
        quantitative: ['#B65700','#FF7A00','#FFBD81',     '#B60500','#FF0700','#FF8481',     '#18067E','#2E0FDB','#A190FE',     '#033E76','#0971D6','#89C5FE'],
        categorical: ['#FF7A00','#2E0FDB','#FF0700','#0971D6',        '#B65700','#18067E','#B60500','#033E76',        '#FFBD81','#A190FE','#FF8481','#89C5FE']
      },
      BlGn: {
        quantitative: ['#3d4051', '#753fb0', '#8f7abf', '#294090', '#6683c3', '#0C6758','#7AB318', '#A0C55E', '#9fa7a3'],
        categorical: [3, 6, 1, 4, 5, 8, 2, 7, 0]
      /**
        quantitative: ['#1B057E','#340FDB','#A490FE',     '#043378','#0A5DD7','#8BBAFE',     '#006D6D','#00D0D0','#80FDFD',     '#008824','#00E13B','#80FEA1'],
        categorical: ['#340FDB','#00E13B','#0A5DD7','#00D0D0',        '#1B057E','#008824','#043378','#006D6D',        '#A490FE','#80FEA1','#8BBAFE','#80FDFD']*/
      },
      GnYl: {
        quantitative: ['#007D47','#00DA7D','#80FEC8',     '#43A100','#64F100','#B5FF81',     '#80AD00','#B9F900','#DFFF81',     '#B6B400','#FFFC00','#FFFD81'],
        categorical: ['#00DA7D','#FFFC00','#64F100','#B9F900',        '#007D47','#B6B400','#43A100','#80AD00',        '#80FEC8','#FFFD81','#B5FF81','#DFFF81']
      },
      YlRd: {
        quantitative: ['#AD0018','#F90022','#FF8192',     '#B65A00','#FF7F00','#FFC081',     '#B68C00','#FFC500','#FFE281',     '#B6B200','#FFFA00','#FFFD81'],
        categorical: ['#F90022','#FFFA00','#FF7F00','#FFC500',        '#AD0018','#B6B200','#B65A00','#B68C00',        '#FF8192','#FFFD81','#FFC081','#FFE281']
      },
    };

    if (type == 'quantitative') {
      return schemes[schemeName].quantitative;
    }

    if (type == 'categorical') {
      var categorical = [];
      schemes[schemeName].categorical.forEach(function(key) {
        categorical.push(schemes[schemeName].quantitative[key]);
      });
      return categorical;
    }
  }
};