/**
 * A collection of biological diagrams created using d3.js and encapsulated
 * for easy use.
 */
tripalD3 = {
  'version': '1.0-dev',

    /**
     * Draw Chart.
     *
     * This function is a common set-up function meant to ensure that figures
     * are consistent, as well as, to facilitate common options. Furthermore,
     * it should make it easier for developers as they only need to remember the
     * name of a single function.
     *
     * Specifically, this function adds the necessary markup for a figure
     * containing chart svg, figure legend and key. It also ensures that any
     * pre-existing chart, legend, key are removed prior to drawing of the chart.
     * Furthermore, it calls the specific chart drawing functions.
     *
     * @param data
     *   A javascript object with the data required to draw the chart. The specifics
     *   of this object depend on the chart being drawn.
     * @param options
     *   A javascript object with any of the following keys:
     *   - chartType: the type of chart to draw; one of pedigree (REQUIRED).
     *   - keyPosition: control the position of the key on your figure;
     *       supported options include right (default), left.
     *       @todo implement top, bottom (note: we don't know the height ahead of time)
     *   - keyWidth: the key is fixed width; default width is 250 (pixels).
     *   - chartOptions: an object containing options to be passed to the chart.
     *       See chart documentation to determine what options are available.
     *    - title: the title of the pedigree diagram.
     *    - legend: a longer description of the diagram to be used as the figure
     *        legend following the title.
     *    - elementId : The ID of the HTML element the diagram should be attached to.
     *    - margin: an object with 'top', 'right','bottom','left' keys. Values
     *        are in pixels and all four keys must be set.
     *    - width: The width of the diagram.
     *    - height: The height of the diagram.
     */
     drawFigure: function(data, options) {

      // Select container.
      if (!options.hasOwnProperty('elementId')) {
        options.elementId = 'tripald3-figure';
      }
      var container = d3.select("#" + options.elementId);

      // Check our container exists and warn the admin if not.
      if (container.empty()) {
        console.error("Element for Tripal D3 Chart not found: #" + options.elementId);
        return;
      }

      // Check they supplied chartType which is REQUIRED.
      if (!options.hasOwnProperty('chartType')) {
        console.error("You must supply a chart type when using tripalD3.drawFigure.");
        return;
      }

      // General Defaults.
      if (!options.hasOwnProperty('title')) {
        options.title = options.chartType.charAt(0).toUpperCase() + options.chartType.slice(1) + " Chart";
      }
      if (!options.hasOwnProperty('legend')) {
        options.legend = "";
      }
      if (!options.hasOwnProperty('keyPosition')) {
        options.keyPosition = "right";
      }
      if (!options.hasOwnProperty('keyWidth')) {
        options.keyWidth = "250";
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
      // @todo better default for height.
      if (!options.hasOwnProperty('height')) {
        options.height = document.getElementById(options.elementId).offsetHeight;
      }

      // Key Defaults.
      if (!options.hasOwnProperty('key')) {
        options.key = {};
      }
      if (!options.key.hasOwnProperty('title')) {
        options.key.title = 'Legend';
      }
      if (!options.key.hasOwnProperty('parentId')) {
        options.key.parentId = options.elementId;
      }
      if (!options.key.hasOwnProperty('width')) {
        options.key.width = options.keyWidth;
      }
      if (!options.key.hasOwnProperty('margin')) {
        options.key.margin = {
            'top': 50,
            'right': 0,
            'bottom': 50,
            'left': 0
        };
      }

      // Chart Option Defaults.
      if (!options.hasOwnProperty('chartOptions')) {
        options.chartOptions = {};
      }
      if (!options.chartOptions.hasOwnProperty('elementId')) {
        options.chartOptions.elementId = options.elementId;
      }
      options.chartOptions.key = options.key;

      // Set up drawing area dimensions.
      var margin = options.chartOptions.margin = options.margin;
      options.chartOptions.width = options.width - margin.right - margin.left;
      options.chartOptions.height = options.height - margin.top - margin.bottom;
      // Take into account the key positions when determining the chart
      // drawing area.
      if (options.keyPosition == "left" || options.keyPosition == "right") {
        options.chartOptions.width -= options.keyWidth;
        if (options.keyPosition == "left") {
          options.margin.left += options.keyWidth;
        }
        if (options.keyPosition == "right") {
          options.key.margin.left += options.chartOptions.width + 10;
        }
      }

      // Append our drawing area to the element specified.
      var svg = container.append("svg")
          .attr("class", "tripald3-tree tripald3-chart")
          .attr("width", options.width)
          .attr("height", options.height)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // Add the figure legend to the indicated element.
      var figLegend = container.append("div")
        .attr("id", options.elementId + "-legend")
        .attr("class", "tripald3-legend");

      figLegend.append("span")
        .attr("class", "tripald3-title")
        .html("Figure: " + options.title + ". ");
      figLegend.append("span")
        .attr("class", "tripald3-desc")
        .html(options.legend);

      // Finally, draw the appropriate chart.
      if (options.chartType === "pedigree") {
        tripalD3.drawPedigreeTree(svg, data, options.chartOptions);
      }
    },

    /**
     * Pedigree Tree
     *
     * @param svg
     *   A D3.js selected SVG element to draw the chart on.
     * @param data
     *   The data to draw the chart for.
     * @param options
     *   A javascript object with any of the following keys:
     *    - elementId: The element to add the svg chart to.
     *    - collapseDuration: The duration of the transition effect used to
     *        collapse the tree.
     *    - nodeFillCollapsed: The fill color of the node when it's subtree is collapsed.
     *    - nodeFill: The color of the node when it is fully expanded.
     *    - backgroundColor: The color of the background of the diagram. This
     *        is used to add the transparent backing to labels.
     *    - nodeLinks: a function used to make the node labels links.
     */
    drawPedigreeTree: function(svg, treeData, options) {

      // Set Defaults.
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
      if (!options.hasOwnProperty('nodeLinks')) {
        options.nodeLinks = function(d) { return null; }
      }

      // Used to generate unique ids for the nodes.
      var i = 0;

      // Initialize the tree.
      var tree = d3.layout.tree()
          .size([options.width, options.height]);

      // Draw tree.
      root = treeData[0];
      drawTree(root);

      // Register resize of tree if config is set.
      if (Drupal.settings.tripalD3.autoResize) {
        resizeTree();
      }

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
          // later in a key.
          var keyData = [];


          tree = tree.size([options.width, options.height]);

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
            'label': 'Germplasm (Pedigree shown)',
            'fillColor': '#FFF'
          });
          keyData.push({
            'classes': ['collapsed'],
            'groupClasses': ['node'],
            'type': 'circle',
            'label': 'Germplasm (Pedigree hidden)',
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
              'url': options.nodeLinks(d),
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
            .attr('height', offset + options.margin.top + options.margin.bottom);

          // Draw the key.
          tripalD3.drawKey(keyData, options.key);

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

    // Set defaults.
    if (!options.hasOwnProperty('elementId')) {
      options.elementId = options.parentId + '-key';
    }
    if (!options.hasOwnProperty('margin')) {
      console.error("Key margins are required because the chart canvas needs to have been set up appropriately.");
    }
    if (!options.hasOwnProperty('width')) {
      console.error("Key Width is required because the chart canvas needs to have been set up appropriately.");
      return;
    }
    if (!options.hasOwnProperty('height')) {
      options.height = data.length * 18;
    } else if (options.height == 'auto') {
      options.height = document.getElementById(options.elementId).offsetHeight;
    }
    var keySpacing = 18;

    var chartContainer = d3.select("#" + options.parentId + " svg");
    if (!chartContainer.empty()) {

      // Determine dimenstions of drawing area.
      var width = options.width - options.margin.right - options.margin.left,
      height = options.height - options.margin.top - options.margin.bottom;

      // Determine transform, taking into account key position.
      var leftMargin = options.margin.left;
      var topMargin = options.margin.top;
      if (options.position === "right") {
        leftMargin = 0 - options.margin.left;
        console.log(options.margin.left + ' vs. ' + leftMargin);
      }

      // Create canvas to draw the key on.
      var svg = chartContainer.append('g')
        .attr("class", "tripald3-key")
        .attr("transform", "translate(" + leftMargin + "," + topMargin + ")");

      // Add the title.
      svg.append("g")
        .attr("class", "key-title")
        .append('text')
          .attr("x", 70)
          .attr('y', 4)
          .style({"font-size": "1.1em", "font-weight": "bold", "text-decoration": "underline"})
          .text(options.title);

      // Now for each item in the data array, create a g legend-item
      // and move it to where we want each member of the lengend to go.
      var keyItems = svg.selectAll('.key-item')
        .data(data)
        .enter()
        .append('g')
        .attr('class', function(d) {
          if (d.groupClasses) {
            return 'key-item ' + d.type + ' ' + d.groupClasses.join(' ');
          } else {
            return 'key-item ' + d.type;
          }
        })
        .attr('transform', function(d, i) {
          var horz = 0;
          // Note: use i+1 to take into account title.
          var vert = (i+1) * keySpacing;
          return 'translate(' + horz + ',' + vert + ')';
        });

      // Draw any lines:
      //---------------------------------
      // Define a function to draw the line.
      var lineFunction = d3.svg.line()
        .x(function(d) { return d.x; })
        .y(function(d) { return d.y; })
        .interpolate("linear");

      // For each key-item of type path, add a path element with the
      // classes specified in data and a length similar to the lines
      // drawn in the diagram.
      var linekeyItems = svg.selectAll('.key-item.path');

      linekeyItems.append('path')
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
      // For each key-item of type circle, add a circle element with the
      // classes specified in data.
      var circlekeyItems = svg.selectAll('.key-item.circle');

      circlekeyItems.append('circle')
        .attr("r", 6)
        .attr('class', function( i, val ) {
          return i.classes.join(' ');
        })
        .style("fill", function(d) { return d.fillColor; })
        .attr('transform','translate(27,0)');

      // Add the labels for each item:
      //---------------------------------
      keyItems.append('text')
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