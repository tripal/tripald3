/**
 * Draws color scheme scales on the TripalD3 general settings page.
 */
Drupal.behaviors.TripalD3_colorscheme_display = {
  attach: function (context, settings) {

    var marginTop = 5,
        marginLeft = 0;

    function createPallet(id) {

      var svg = d3.selectAll('#TD3-scheme.' + id)
        .append("svg")
        .attr("width", 800)
        .attr("height", 60);

      var palletQuant = svg.append('g')
          .classed('pallet',true)
          .classed('quantitative',true)
          .attr("transform", "translate(" + marginLeft + "," + marginTop + ")");

      var swatchIndex = 0;
      console.log(Drupal.settings.tripalD3.colorSchemes[id].quantitative);
      palletQuant.selectAll('rect')
        .data(Drupal.settings.tripalD3.colorSchemes[id].quantitative)
        .enter()
          .append('rect')
            .attr('width', 20)
            .attr('height', 50)
            .attr('x', function(d) { swatchIndex = swatchIndex + 1; return 22 * swatchIndex; })
            .attr('fill', function (d) { return d; });
/**
      var palletCategory = svg.append('g')
          .classed('pallet',true)
          .classed('categorical',true)
          .attr("transform", "translate(" + (marginLeft + 350) + "," + marginTop + ")");

      var swatchIndex = 0;
      palletCategory.selectAll('rect')
        .data(Drupal.settings.tripalD3.colorSchemes[id].categorical)
        .enter()
          .append('rect')
            .attr('width', 20)
            .attr('height', 50)
            .attr('x', function(d) { swatchIndex = swatchIndex + 1; return 22 * swatchIndex; })
            .attr('fill', function (d) { return d; });
*/
    }

    Object.keys(Drupal.settings.tripalD3.colorSchemes).forEach(function (schemeId) {
      createPallet(schemeId);
    });

  }
};