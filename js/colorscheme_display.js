/**
 * Draws color scheme scales on the TripalD3 general settings page.
 */

// Variable to flag that this behavior has been attached and
// should execute this block once.
var initialized = false;
// svg elements margins.
var marginTop  = 5,
    marginLeft = 0;

// Attach behavior.
Drupal.behaviors.TripalD3_colorscheme_display = {
  attach: function (context, settings) {
    var settingsvar = drupalSettings.tripald3.colorscheme_display.variable;    
    tripalD3Initialize(settingsvar);
  }
};


// Functions.


/**
 * Construct colour scheme pallets next to colour scheme option.
 * This has mechanism to allow for single execution (attach once). 
 * 
 * @param object settingsvar
 *   Contains colour scheme metadata (colour, id, name etc.).
 */
function tripalD3Initialize(settingsvar) {   
  if (!initialized) {
    Object.keys(settingsvar.tripalD3.colorSchemes).forEach(function (schemeId) {
      if (typeof settingsvar.tripalD3.colorSchemes[schemeId] === 'object') {
        createPallet(settingsvar, schemeId);
      }
    });
  }
   
  initialized = true;
}

/**
 * Create svg elements that form the colour scheme pallets.
 * 
 * @param object settingsvar 
 *   Contains colour scheme metadata (colour, id, name etc.).
 * @param string id 
 *   Id string representing a single colour scheme.
 */
function createPallet(settingsvar, id) {
  var svg = d3.selectAll('#TD3-scheme-' + id)
    .append("svg")
    .attr("width", 800)
    .attr("height", 60);

  var palletQuant = svg.append('g')
      .classed('pallet',true)
      .classed('quantitative',true)
      .attr("transform", "translate(" + marginLeft + "," + marginTop + ")");

  var swatchIndex = 0;
  palletQuant.selectAll('rect')
    .data(settingsvar.tripalD3.colorSchemes[id].quantitative)
    .enter()
      .append('rect')
        .attr('width', 20)
        .attr('height', 50)
        .attr('x', function(d) { swatchIndex = swatchIndex + 1; return 22 * swatchIndex; })
        .attr('fill', function (d) { return d; });
}
