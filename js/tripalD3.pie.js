/**
 * @file
 * Simple Pie Chart functionality.
 */
tripalD3.pie = {
  /**
   * Draw a simple pie chart.
   *
   * @param svg
   *   The canvas to draw the pie chart on.
   * @param data
   *   The data to draw the pie chart with.
   * @param options
   *   An object containing options for this ring. Supported keys include:
   *     - width: the width of the canvas
   *     - height: the height of the canvas
   *     - maxRadius: the outside radius of the pie chart.
   *     - labelPadding: the amount to pad the labels.
   */
  drawSimplePie: function(svg, data, options) {

    // Set defaults.
    if (!options.hasOwnProperty('width')) {
      options.width = 250;
    }
    if (!options.hasOwnProperty('height')) {
      options.height = 250;
    }
    if (!options.hasOwnProperty('maxRadius')) {
      options.maxRadius = (options.height - options.margin.top - options.margin.bottom) / 2;
    }
    if (!options.hasOwnProperty('labelPadding')) {
      options.labelPadding = options.width - options.height - 300;
    }
    if (!options.hasOwnProperty('drawKey')) {
      options.drawKey = true;
    }

    // Set some additional values.
    options.donutWidth = options.maxRadius;
    options.timbitRadius = 0;

    // Make sure we're drawing from the center of the canvas.
    console.log(options.height);
    var centerTop = options.maxRadius + options.margin.top;
    var centerLeft = options.maxRadius + options.margin.left;
    svg.attr("transform", "translate(" + centerLeft + "," + centerTop + ")");

    // Retrieve a set of colours to use.
    var colorSchemeId = Drupal.settings.tripalD3.colorSchemes.selected;
    var colors = Drupal.settings.tripalD3.colorSchemes[colorSchemeId].categorical;
    // @note alleles became categories.
    console.log(data);
    var categories = [];
    data.forEach(function(d) {
      categories.push(d.label);
    });
    var color = d3.scale.ordinal()
      .range(colors)
      .domain(categories);

    // Draw the circle background.
    svg.append("circle")
      .attr("class", "pie-background")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", options.maxRadius-1)
      .attr("fill", "#808080");

    // Actually draw each ring/donut in the pie chart based on the data provided.
    var ringOptions = {
      "donutWidth": options.donutWidth,
      "color": color,
    }
    tripalD3.pie.drawRing(svg, data, 0, options.maxRadius-2, ringOptions);

    // Draw the Key.
    if (options.drawKey === true) {
      var keyData = [];
      data.forEach(function(d) {
        var labelClass = d.label.replace(/ /g,'-').replace(/[!\"#$%&'\(\)\*\+,\.\/:;<=>\?\@\[\\\]\^`\{\|\}~]/g, '');
        keyData.push({
          'classes': ['pie', 'category', labelClass],
          'type': 'rect',
          'label': d.label,
          'fillColor': color(d.label)
        });
      });
      tripalD3.drawKey(keyData, options.key);
    }
  },

  /**
   * Draw a simple donut pie chart.
   *
   * @param svg
   *   The canvas to draw the pie chart on.
   * @param data
   *   The data to draw the pie chart with.
   * @param options
   *   An object containing options for this ring. Supported keys include:
   *     - width: the width of the canvas
   *     - height: the height of the canvas
   *     - maxRadius: the outside radius of the pie chart.
   *     - donutWidth: the width of the donut (difference between inner
   *         and outer radius).
   *     - timbitRadius: the inside radius of the donut.
   *     - labelPadding: the amount to pad the labels.
   */
  drawSimpleDonut: function(svg, data, options) {

    // Set defaults.
    if (!options.hasOwnProperty('width')) {
      options.width = 250;
    }
    if (!options.hasOwnProperty('height')) {
      options.height = 250;
    }
    if (!options.hasOwnProperty('maxRadius')) {
      options.maxRadius = (options.height - options.margin.top - options.margin.bottom) / 2;
    }
    if (!options.hasOwnProperty('donutWidth')) {
      options.donutWidth = Math.floor(options.maxRadius / 2);
    }
    //Inside joke, donutHole ;-).
    if (!options.hasOwnProperty('timbitRadius')) {
      options.timbitRadius = options.maxRadius - options.donutWidth - 4;
    }
    if (!options.hasOwnProperty('labelPadding')) {
      options.labelPadding = options.width - options.height - 300;
    }
    if (!options.hasOwnProperty('drawKey')) {
      options.drawKey = true;
    }

    // Make sure we're drawing from the center of the canvas.
    console.log(options.height);
    var centerTop = options.maxRadius + options.margin.top;
    var centerLeft = options.maxRadius + options.margin.left;
    svg.attr("transform", "translate(" + centerLeft + "," + centerTop + ")");

    // Retrieve a set of colours to use.
    var colorSchemeId = Drupal.settings.tripalD3.colorSchemes.selected;
    var colors = Drupal.settings.tripalD3.colorSchemes[colorSchemeId].categorical;
    // @note alleles became categories.
    console.log(data);
    var categories = [];
    data.forEach(function(d) {
      categories.push(d.label);
    });
    var color = d3.scale.ordinal()
      .range(colors)
      .domain(categories);

    // Draw the circle background.
    svg.append("circle")
      .attr("class", "pie-background")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", options.maxRadius-1)
      .attr("fill", "#808080");
    svg.append("circle")
      .attr("class", "pie-center")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", options.timbitRadius)
      .attr("fill", "#FFF");

    // Actually draw each ring/donut in the pie chart based on the data provided.
    var ringOptions = {
      "donutWidth": options.donutWidth,
      "color": color,
    }
    tripalD3.pie.drawRing(svg, data, 0, options.maxRadius-2, ringOptions);

    // Draw the Key.
    if (options.drawKey === true) {
      var keyData = [];
      data.forEach(function(d) {
        var labelClass = d.label.replace(/ /g,'-').replace(/[!\"#$%&'\(\)\*\+,\.\/:;<=>\?\@\[\\\]\^`\{\|\}~]/g, '');
        keyData.push({
          'classes': ['pie', 'category', labelClass],
          'type': 'rect',
          'label': d.label,
          'fillColor': color(d.label)
        });
      });
      tripalD3.drawKey(keyData, options.key);
    }
  },

  /**
   * This function draws the segments of the pie chart. Each time this function
   * is called it draws one of the rings/donuts. The data provided should be
   * specific to that particular ring/donut, the index is the 0-indexed order
   * and the radius is the maximum radius for this ring.
   *
   * @param svg
   *   The canvas to draw the ring on.
   * @param _data
   *   The data to draw the pie chart ring for.
   * @param index
   *   The index for this particular ring in the case that the completed pie
   *   chart has multiple rings.
   * @param radius
   *   The radius of the ring.
   * @options
   *   An object containing options for this ring. Supported keys include:
   *     - label: the label for this ring. Helpful in the case of multiple
   *         rings for a single pie chart.
   *     - donutWidth: the width of the donut.
   */
  drawRing: function(svg, _data, index, radius, options) {

    // Set Defaults.
    if (!options.hasOwnProperty('label')) {
      options.label = "";
    }
    if (!options.hasOwnProperty('donutWidth')) {
      options.donutWidth = 62;
    }

    // Set up function to draw the arc.
    var arc = d3.svg.arc()
      .outerRadius(radius - 2)
      .innerRadius(radius - options.donutWidth);

    // Set up the function to draw the pie.
    var pie = d3.layout.pie()
      .sort(null)
      .value(function(d) { return d.count; });

    // Make the series name class-compatible (if there is one).
    var seriesName = "";
    if (options.label) {
      seriesName = "m" + _data.label.replace(/ /g,'-').replace(/[!\"#$%&'\(\)\*\+,\.\/:;<=>\?\@\[\\\]\^`\{\|\}~]/g, '');
    }

    // Create the ring grouping element.
    var ring = svg.append("g")
      .attr("class", "ring series " + seriesName);

    // Create the elements per category.
    var g = ring.selectAll(".arc")
        .data(pie(_data))
      .enter().append("g")
        .attr("class", function(d) {
          var _label = d.data.label.replace(/ /g,'-').replace(/[!\"#$%&'\(\)\*\+,\.\/:;<=>\?\@\[\\\]\^`\{\|\}~]/g, '');
          return "arc marker-name " + _label;
        });

    // Actually draw the arcs.
    g.append("path")
        .attr("d", arc)
        .style("fill", function(d) { return options.color(d.data.label); })
        .attr("class", function(d) {
          var _label = d.data.label.replace(/ /g,'-').replace(/[!\"#$%&'\(\)\*\+,\.\/:;<=>\?\@\[\\\]\^`\{\|\}~]/g, '');
          return 'pie category ' + _label;
        })
        .append("svg:title")
          .text(function(d) { return d.data.label + ' (' + d.data.count + ')'; });

  },
};
