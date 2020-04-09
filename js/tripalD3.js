
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
   *       one of pedigree, simplepie, simpledonut, multidonut, simplebar, simplehistogram.
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
      success = tripalD3.histo.drawSimpleHistogram(svg, data, options.chartOptions);
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

      }
