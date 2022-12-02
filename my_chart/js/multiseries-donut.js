/**
 * Draws pie chart.
 */
Drupal.behaviors.tripalD3demoMultiseriesDonut = {
  attach: function (context, settings) {
    
    var data = drupalSettings.tripalD3.vars.multiseriesDonutData;
    data = JSON.parse(data);

    // Draw your chart.
    tripalD3.drawFigure(
      data,
      {
        "chartType" : "multidonut",
        "elementId": "tripald3-multiseriesdonut",
        "height": 250,
        "width": 650,
        "keyPosition": "right",
        "title": "Comparison of allele calls across 3 FBA-1 markers",
        "legend": "The above chart shows the allele ratios for three seperate markers assaying the FBA-1 (fictional but amazing) gene.",
        "key": {"title": "Alleles"},
      }
    );
  }
};