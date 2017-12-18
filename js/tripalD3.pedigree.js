/**
 * @file
 * Pedigree Diagram Functionality.
 */
tripalD3.pedigree = {

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
   *    - drawKey: whether or not to draw the key; the default is true.
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
    if (!options.hasOwnProperty('drawKey')) {
      options.drawKey = true;
    }

    // Used to generate unique ids for the nodes.
    var i = 0;

    // Initialize the tree.
    var tree = d3.layout.tree()
        .size([options.width, options.height]);

    // Draw tree.
    root = treeData[0];
    drawTree(root, options);

    // Register resize of tree if config is set.
    if (Drupal.settings.tripalD3.autoResize) {
      resizeTree();
    }

    /**
     * Resize the tree when the window size changes
     */
    function resizeTree() {
      window.addEventListener('resize', function() {

        // @todo: figure legend ends up at the top.
        // @todo: key is not drawn in the new location.
        console.error("Known Bug: Resize disabled at this time.");
        return;

        d3.select("#" + options.elementId + " svg").remove();

        width = document.getElementById(options.elementId).offsetWidth;
        height = options.height + options.margin.top + options.margin.bottom;

        // Initialize the tree.
        tree = d3.layout.tree()
            .size([
              width - options.margin.right - options.margin.left,
              height - options.margin.top - options.margin.bottom
            ]);

        // Append our drawing area to the specified element.
        svg = d3.select("#" + options.elementId).append("svg")
          .attr("width", width)
          .attr("height", height)
          .append("g")
          .attr("transform", "translate(" + options.margin.left + "," + options.margin.top + ")");

        // No need to clone options in this case because we want the original
        // behaviour to be used. This assumes that the drawTree function itself
        // does not change options ;-).
        drawTree(root, options);
      });
    }

    /**
     * Function used to draw the tree. We use a function to allow
     * us to reuse code when re-drawing after click events.
     *
     * @param source
     *   The root of the tree which includes the definition
     *   of the entire tree to be drawn.
     * @param drawingOptions
     *   Options specific to this particular drawing of the tree. These options
     *   ensure that the original options are not changed. Supported options
     *   include all of those supported by the drawPedgreeTree function.
     *   NOTE: DO NOT CHANGE the options within this function. They are
     *   sometimes passed by reference if changes are not needed.
     */
    function drawTree(source, drawingOptions) {

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
        var colors = tripalD3.getColorScheme("categorical");

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
        if (drawingOptions.drawKey === true) {
          tripalD3.drawKey(keyData, options.key);
        }
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

        // Create new options and set drawKey to false. The key does not need
        // to be drawn because nothing has changed in that respect.
        newOptions = Object.assign({}, options);
        newOptions.drawKey = false;
        drawTree(d, newOptions);
    }
  },
};
