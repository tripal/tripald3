
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


      }
