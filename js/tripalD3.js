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
   *   - chartType: the type of chart to draw; (REQUIRED)
   *       one of pedigree, simplepie, simpledonut, multidonut, simplebar, simplehistogram 
   *       and histogram.
   *   - elementId : The ID of the HTML element the diagram should be attached to.
   *   - width: The width of the drawing canvas (including key and margins) in pixels.
   *   - height: The height of the drawing canvas (including key and margins) in pixels.
   *   - title: the title of the figure diagram.
   *   - legend: a longer description of the diagram to be used as the figure
   *        legend following the title. This should include all  relevant scientific
   *        information as well as instructions on how to interact with the chart.
   *   - margin: an object with 'top', 'right','bottom','left' keys. Values
   *        are in pixels and all four keys must be set.
   *   - chartOptions: an object containing options to be passed to the chart.
   *       See chart documentation to determine what options are available.
   *   - drawKey: whether or not to draw the key; default is "true".
   *   - keyPosition: control the position of the key on your figure;
   *       supported options include right (default) or left.
   *       @todo implement top, bottom (note: we don't know the height ahead of time)
   *   - keyWidth: the key is fixed width; default width is 250 (pixels).
   *   - key: an object containing additional options for the key.
   *       See "drawKey" function for all available options. Some include:
   *       - title: the title of the key; default "Legend".
   *       - margin: an object with 'top', 'right','bottom','left' keys.
   *           Values are in pixels and all four keys must be set.
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
      return false;
    }

    // Check they supplied chartType which is REQUIRED.
    if (!options.hasOwnProperty('chartType')) {
      console.error("You must supply a chart type when using tripalD3.drawFigure.");
      return false;
    }

    // Check there even is any data!
    if (data.length == 0) {
      console.error("You must supply data when using tripalD3.drawFigure.");
      return false;
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
      options.keyWidth = 250;
    }
    if (!options.hasOwnProperty('margin')) {
      options.margin = {
          'top': 20,
          'right': 20,
          'bottom': 0,
          'left': 20
      };
    }
    if (!options.hasOwnProperty('width')) {
      options.width = document.getElementById(options.elementId).offsetWidth;
      console.log(document.getElementById(options.elementId));
      console.log(options.width);
      if (options.width <= options.keyWidth) {
        options.width = 50 + options.keyWidth;
      }
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
      options.key.margin = Object.assign({}, options.margin);
      options.key.margin.top += 10;
    }

    // Chart Option Defaults.
    if (!options.hasOwnProperty('chartOptions')) {
      options.chartOptions = {};
    }
    if (!options.chartOptions.hasOwnProperty('elementId')) {
      options.chartOptions.elementId = options.elementId;
    }
    if (!options.hasOwnProperty('drawKey')) {
      if (options.chartType === 'simplebar') {
        options.drawKey = false;
      }
      else {
        options.drawKey = true;
      }
    }
    options.chartOptions.drawKey = options.drawKey;
    options.chartOptions.key = options.key;

    // Check for errors in the options!
    //-------------------------------------------
    // We do this here so we don't have to check existance of the key ;-).
    // Check that the width is an integer
    if (!(typeof options.width === 'number') || !((options.width % 1 ) === 0)) {
      console.error("The width for a TripalD3 figure should be an integer. You supplied: " + options.width);
      return false;
    }
    // Check that the height is an integer.
    if (!(typeof options.height === 'number') || !((options.height % 1 ) === 0)) {
      console.error("The height for a TripalD3 figure should be an integer. You supplied: '" + options.height + "'");
      return false;
    }
    // Check that the keyWidth is an integer
    if (!(typeof options.key.width === 'number') || !((options.key.width % 1 ) === 0)) {
      console.error("The key width for a TripalD3 figure should be an integer. You supplied: '" + options.key.width + "'");
      return false;
    }
    // Check that the key width is not more then the chart width ;-).
    if (options.key.width >= options.width) {
      console.error("The chart width includes the key width and as such the key width should be less than the chart width. You supplied key width: " + options.key.width + "; chart width: " + options.width);
      return false;
    }
    // Check that the margin is an object.
    if (options.margin === null || typeof options.margin !== 'object') {
      console.error("The margin should be an object with right, left, top, and bottom keys.");
      return false;
    }
    // Check that all keys have been supplied for the margin and that they're all integers.
    var error = false;
    ["right","left","top","bottom"].forEach(function(key) {
      if (error === false) {
        if (!(key in options.margin)) {
          console.error("You must supply all keys (right, left, top, bottom) for the margin. You didn't supply the '"+key+"' margin.");
          error = true;
        }
      }
      if (error === false) {
        if (!(typeof options.margin[key] === 'number') || !((options.margin[key] % 1 ) === 0)) {
          console.error("The " + key + " margin for a TripalD3 figure should be an integer. You supplied: '" + options.margin[key] + "'");
          error = true;
        }
      }
    });
    if (error === true) { return false; }
    // Check that the margin is an object.
    if (options.margin === null || typeof options.margin !== 'object') {
      console.error("The margin should be an object with right, left, top, and bottom keys.");
      return false;
    }
    // Check that all keys have been supplied for the key margin and that they're all integers.
    ["right","left","top","bottom"].forEach(function(key) {
      if (error === false) {
        if (!(key in options.key.margin)) {
          console.error("You must supply all keys (right, left, top, bottom) for the key margin. You didn't supply the '"+key+"' margin.");
          error = true;
        }
      }
      if (error === false) {
        if (!(typeof options.key.margin[key] === 'number') || !((options.key.margin[key] % 1 ) === 0)) {
          console.error("The " + key + " margin for a TripalD3 figure should be an integer. You supplied: '" + options.key.margin[key] + "'");
          error = true;
        }
      }
    });
    if (error === true) { return false; }
    // Check that drawKey is a boolean.
    if (!(options.drawKey === false || options.drawKey === true)) {
      console.error("The drawKey option should be one of 'true' or 'false', you supplied '" + options.drawKey + "'");
      return false;
    }
    // Check that the keyPosition is supported.
    // # Added additional key position/area to render.
    if (!(options.keyPosition == "right" || options.keyPosition == "left" || options.keyPosition == "top")) {
      console.error("The keyPosition supplied is not supported. Supported key positions are 'left' and 'right', you supplied '" + options.keyPosition + "'");
      return false;
    }

    // Set up drawing area dimensions.
    var margin = options.chartOptions.margin = options.margin;
    options.chartOptions.width = options.width - margin.right - margin.left;
    options.chartOptions.height = options.height - margin.top - margin.bottom;
    // Take into account the key positions when determining the chart
    // drawing area but only if we're drawing the key ;-).

    // Account for the height of the leged on top.
    var addHeight = 25;
    var collapsedHeight = 0;

    if (options.chartOptions.drawKey) {
      if (options.keyPosition == "left" || options.keyPosition == "right"  || options.keyPosition == "top") {
        // Left or Right
        if (options.keyPosition == "left") {
          options.chartOptions.width -= options.keyWidth;
          options.margin.left += options.keyWidth;
        }
        if (options.keyPosition == "right") {
          options.chartOptions.width -= options.keyWidth;
          options.key.margin.left += options.chartOptions.width + 10;
        }

        // Render keys on top of tree.

        if (options.keyPosition == "top") {
          addHeight = 150;

          // 5 px from the title - add the legend key.
          options.key.margin.top = 5;

          // Levels/Depth to collapse.
          options.chartOptions.collapsedDepth = options.collapsedDepth;

          // Add this position to options parameter to cascade into other functions.
          options.chartOptions.position = 'top';
        }
      }
    }

    if (options.pass) {
      options.chartOptions.pass = options.pass;
    }

    // Make our container the size of the chart.
    container.style({"width": options.width + "px"});

    // Remove existing chart.
    d3.selectAll('#'+options.elementId+' svg.tripald3-chart').remove();
    d3.selectAll('#'+options.elementId+'-legend').remove();

    // Append our drawing area to the element specified.
    var svg = container.append("svg")
        .attr("class", "tripald3-chart")
        .attr("width", options.width)
        .attr("height", (options.height + addHeight))
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + (margin.top + addHeight) + ")");

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
    var success = null;
    if (options.chartType === "pedigree") {
      success = tripalD3.pedigree.drawPedigreeTree(svg, data, options.chartOptions);
    }
    else if (options.chartType === 'simplepie') {
      success = tripalD3.pie.drawSimplePie(svg, data, options.chartOptions);
    }
    else if (options.chartType === 'simpledonut') {
      success = tripalD3.pie.drawSimpleDonut(svg, data, options.chartOptions);
    }
    else if (options.chartType === 'multidonut') {
      success = tripalD3.pie.drawMultiDonut(svg, data, options.chartOptions);
    }
    else if (options.chartType === 'simplebar') {
      success = tripalD3.bar.drawSimpleBar(svg, data, options.chartOptions);
    }
    else if (options.chartType === 'simplehistogram') {
      success = tripalD3.simpleHisto.drawSimpleHistogram(svg, data, options.chartOptions);
    }
    else if (options.chartType === 'histogram') {
      success = tripalD3.histo.drawHistogram(svg, data, options.chartOptions);
    }
     
    // If drawing the chart failed with an error message,
    // remove the elements to clean up the canvas. The admin already
    // knows what happened thanks to the message; we don't want to show
    // the user a big mess ;-p.
    if (success === false) {
      container.selectAll("*").remove();
    }

    // Return the result of the chart function.
    return success;
  },

  /**
   * Draws a graphical key on an existing diagram to explain the colours
   * and styles used.
   *
   * @param data
   *   An array of key items where each item is an object with the following keys:
   *    - classes: the classes attached to the item represented. These are applied
   *        to the colored item of the key (circle, rect, path).
   *    - groupClasses: additional classes to attach to the grouping element in
   *        the key. The type of element is added by default.
   *    - label: The human-readable label for this key item.
   *    - type: the type of svg element this key item represents.
   *        Supported types include: circle, rect, path.
   *    - fillColor: the color of the circle/rect.
   *    - strokeColor: the color of the line.
   *
   * @param $options
   *   A javascript object with any of the following keys:
   *    - parentId: the ID of the parent element containing the SVG to draw
   *        the key on (REQUIRED).
   *    - elementId: the ID to use for the grouping element containing the key.
   *    - width: the width of the key in pixels (REQUIRED).
   *    - height: the height of the key in pixels. The default is calculated
   *        based on the number of key elements passed in.
   *    - margin: the margin to use for the key. an object with 'top', 'right',
   *        'bottom','left' keys. Values are in pixels and all four keys must be set.
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
      return false;
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
      }

      // Create canvas to draw the key on.
      var svg = chartContainer.append('g')
        .attr("class", "tripald3-key")
        .attr("transform", "translate(" + leftMargin + "," + topMargin + ")");


      // # Figure key elements.

      if (options.pos && options.pos == 'top') {
        // Figure keys on top bar.
        // When option to draw figure key on top of the tree, Legend should be replaced
        // with the term Germplasm (no text styling applied.)

        var SVGWidth = options.wrapperWidth + options.margin.right + options.margin.left;

        // Main container.
        var keyWrapper = chartContainer.append('g')
          .attr('id', 'parentage-pedigree-top-figure-key')
          .attr('transform', 'translate(1, 0)');

        // Box container
        keyWrapper.append('g')
          .attr('id', 'parentage-pedigree-top-box-container')
          .append('rect')
            .attr('height', 70)
            // Less 2, 1px on either side to account for 1px stroke width.
            .attr('width', (SVGWidth - 2))
            .attr('fill', '#F9F9F9')
            .attr('stroke', '#D0D0D0')
            .attr('y', 5);

        // Since figure legend keys are present only when they are shown in the tree,
        // compute cell required for each keys present.
        // Padding 5px each side.
        var cellPadding = 10;
        var keyContainer = Math.round(SVGWidth / data.length);

        var keyItemCell = keyWrapper.append('g')
          .attr('id', 'parentage-pedigree-figure-keys-container')
          .attr('transform', 'translate(' + (cellPadding * 2) + ', 0)')
          .selectAll('g')
          .data(data)
          .enter()
          .append('g')
          .attr('class', 'key-item-container')
            .attr('id', function(d, i) {
              return 'key-item-g-' + (i + 1);
            })
            .attr('title', function(d) {
              return d.label;
            })
            .attr('transform', function(d, i) {
              return 'translate(' + (keyContainer * i) + ', ' + (cellPadding / 2) + ')';
            });

        // Figure key text.
        keyItemCell.append('text')
          .text(function(d) {
            return d.label.trim();
          })
          .attr('text-anchor', 'left')
          .attr('font-weight', 300)
          .attr('font-size', function() {
            return (options.wrapperWidth < 750) ? 8 : 12;
          });

        // With text added, wrap to create multi-line text.
        keyItemCell.selectAll('text')
          .call(wrapWords);


        // Figure key line.
        var lineFunction = d3.svg.line()
          .x(function(d) { return d.y; })
          .y(function(d) { return d.x; })
          .interpolate("linear");

        d3.selectAll('.key-item-container')
          .append('path')
          .attr('stroke-width', 5)
          .attr("d", function(d) {
            // Draw a line 60px long.
            return lineFunction([{x:45, y:0},{x:15, y:0}]);
          })
          .attr('stroke', function(d) { return d.stroke; });

        // Figure key circles.
        d3.selectAll('.key-item-container')
          .append('circle')
          .attr('r', function(d, i) {
            return (i < 2) ? 8 : 5;
          })
          .attr('fill', function(d, i) {
            return (i == 1) ? '#B3B3B3' : '#FFFFFF';
          })
          .attr('stroke-rendering', 'auto')
          .attr('stroke', '#000000')
          .attr('stroke-width', 2)
          .attr('cy', 49)
          .attr('cx', function(d, i) {
            return (i < 2) ? cellPadding : 0;
          });

        // Figure key shown and hidden are special keys in that they
        // both do not contain a line.
        d3.select('#key-item-g-1 tspan')
          .attr('x', 35)
          .attr('y', function() {
            return (options.wrapperWidth < 750) ? 5 : 18;
          });

        d3.select('#key-item-g-2 tspan')
          .attr('x', 35)
          .attr('y', function() {
            return (options.wrapperWidth < 750) ? 5 : 18;
          });

        // Germplasm Text.
        keyWrapper.append('g')
          .attr('class', 'key-title')
          .append('text')
            .style('font-size', '14px')
            .style('font-family', 'serif')
            .attr('dx', (cellPadding * 2))
            .attr('y', 30)
            .text('Germplasm');

        if (options.collapsedDepth && options.collapsedDepth > 0) {
          // Add the note that first 3 layers were collapsed.
          var textNote = [
            'Note: Only the first ' + options.collapsedDepth + ' levels of this pedigree diagram are expanded,',
            'please double click on hidden germplasm to expand tree.'
          ];

          // split text into halves when not enough room that text would end up being clipped.
          keyWrapper.append('g')
            .append('text')
            .text(function() {
              return (options.wrapperWidth < 750) ? textNote[0] : textNote[0] + ' ' + textNote[1];
            })
            .attr('y', 95)
            .attr('font-size', '11px')
            .attr('font-weight', 300);

          if (options.wrapperWidth < 750) {
            keyWrapper.append('g')
              .append('text')
              .text(textNote[1])
              .attr('y', 107)
              .attr('font-size', '11px')
              .attr('font-weight', 300);
          }
        }
      }
      else {
        // Left or Right.
        svg.append("g")
        .attr("class", "key-title")
        .append('text')
          .attr("x", 70)
          .attr('y', 4)
          .style(function() {
            return (options.pos) ? '' : {"font-size": "1.1em", "font-weight": "bold", "text-decoration": "underline"}
          })
          .text(function() {
            return (options.pos) ? 'Germplasm' : options.title;
          });

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
          .x(function(d) { return d.x })
          .y(function(d) { return d.y; })
          .interpolate("linear");

        // For each key-item of type path, add a path element with the
        // classes specified in data and a length similar to the lines
        // drawn in the diagram.
        svg.selectAll('.key-item.path').append('path')
          .attr('class', function( i, val ) {
            return i.classes.join(' ');
          })
          .attr("d", function(d) {
            // Draw a line 60px long.
            return lineFunction([{x:0, y:0},{x:55, y:0}]);
          })
          .attr('stroke', function(d) { return d.stroke; });

        // Draw any rectangles:
        //---------------------------------
        // For each key-item of type circle, add a circle element with the
        // classes specified in data.
        svg.selectAll('.key-item.rect').append('rect')
          .attr("x", 45)
          .attr("y", -7)
          .attr("width", 14)
          .attr("height", 14)
          .attr('class', function( i, val ) {
            return i.classes.join(' ');
          })
          .style("fill", function(d) { return d.fillColor; });

        // Draw any circles:
        //---------------------------------
        // For each key-item of type circle, add a circle element with the
        // classes specified in data.
        svg.selectAll('.key-item.circle').append('circle')
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
    }
  },

  /**
   * Provides an infinite progress throbber in the form of an Ellipsis (3 dots).
   *
   * HOW TO USE:
   *   This function returns the throbber so simply use .remove()
   * @code
       throbber = ellipsisThrobber(svg, {'left':50, 'top':50});
       setTimeout(function(){ throbber.remove() }, 3000);
   * @endcode
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
   * Retrieve the colours for a given colour scheme.
   *
   * @param type
   *   The type of scheme to return false; one of quantitative or categorical (REQUIRED).
   * @param schemeName
   *   The machine name of the color scheme to return the colors of;
   *   Defaults to the scheme chosen by the administrator.
   *
   * @return
   *   An array of HEX codes in the order they should be applied to elements.
   */
  getColorScheme: function(type, schemeName) {

    //Retrieve default color scheme; if not set.
    if (!schemeName) {
      schemeName = Drupal.settings.tripalD3.colorSchemes.selected;
    }

    // Grab the colour schemes added to Drupal settings by tripald3_load_libraries().
    var schemes = Drupal.settings.tripalD3.colorSchemes;

    if (type == 'quantitative') {
      return schemes[schemeName].quantitative;
    }

    if (type == 'categorical') {
      return schemes[schemeName].categorical;
    }
  },


  /**
   * Add watermark to visualizations.
   *
   * @param options
   *   watermark : image source, preferably the absolute path to the image.
   *
   * @return integer
   *   Number of SVGs stamped.
   */
   placeWatermark: function(options = null) {
     var stampedCount = 0;

     if (jQuery('svg')) {
       // Begin watermark-ing.

       // Find all svg and stamp.
       jQuery('svg').each(function(i) {
         var overlayId    = 'tripald3-watermark-overlay' + i;
         var overlay      = '<div id="' + overlayId + '">&nbsp;</div>';

         // Remove existing watermark if needed.
         d3.selectAll('#'+overlayId).remove();

         // Rule definition in tripald3.css.
         var overlayClass = 'tripald3-watermark';
         jQuery(this).parent().css('position', 'relative').append(overlay);

         var refOverlay = jQuery('#' + overlayId);
         // Set general style for the overlay.
         refOverlay.addClass(overlayClass);

         // Set image source for the watermark.
         if (options) {
           // Has image source.
           refOverlay.css("background-image", function() {
             return 'url(' + options.watermark + ')';
           });
         }
         else {
           // Default watermark: This can be implemented
           // for a global watermark.
           refOverlay.addClass('tripald3-default-watermark');
         }

         stampedCount++;
       });
     }

     return stampedCount;
   }
};


// Wrap long text value and set the first line
// to bold and capitalized.
function wrapWords(text) {
  text.each(function() {
    // Reference text.
    var text  = d3.select(this);

    // Clean up words - No Germplasm, No Pedigree either.
    if (text.text() == 'Germplasm (Pedigree shown)') {
      text.text('Shown');
    }
    else if(text.text() == 'Germplasm (Pedigree hidden)') {
      text.text('Hidden');
    }

    // Read the words in the text.
    var textString = text.text();
    var words = textString.split(' ');

    /// Clear the text so no duplicate label shown.
    text.text(null);

    var word,
      line = [],
      lineNumber = 0,
      lineHeight = 1; // ems
      y = text.attr('y') - 10,
      dy = (text.attr('font-size') == 12) ? 2 : 5;

    words.reverse();

    var i = 0;
    while (word = words.pop()) {
      if (i == 0) {
        word = (word == 'is') ? 'is a' : word;
        word.toLowerCase();
      }
      else {
        if (words[ (words.length - 1) ] == 'of') {
          word = word + ' of';
          words.pop();
        }

        word = word.toUpperCase();
      }

      text.append('tspan')
        .attr('class', 'bp-tspan')
        .attr('x', 10)
        .attr('y', y)
        .attr('dy', ++lineNumber * lineHeight + dy + 'em')
        .text(word.trim())
        .attr('font-family', 'sans-serif');

      i++;
    }
  });
}
