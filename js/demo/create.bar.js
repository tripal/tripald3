/**
 * Draws bar chart in demo page.
 */

Drupal.behaviors.tripalD3demoSimpleBar = {
  attach: function (context, settings) {

    // Pull the data out of the javascript settings.
    var barData = [
      {
        "label": "Accession",
        "count": 2390,
      },
      {
        "label": "Cross",
        "count": 567,
      },
      {
        "label": "RIL",
        "count": 115,
      },
      {
        "label": "Cultivar",
        "count": 78,
      },
    ];

    // Draw your chart.
    tripalD3.drawFigure(
      barData,
      {
        "chartType" : "simplebar",
        "elementId": "tripald3-barchart",
        "height": 400,
        "width": 600,
        "keyPosition": "right",
        "title": "Proportion of <em>Tripalus databasica</em> Germplasm Types",
        "legend": "The above bar chart depicts the number of germplasm available per type for <em>Tripalus databasica</em>.",
        "chartOptions": {
          "xAxisTitle": "Type of Germplasm",
          "yAxisTitle": "Number of Germplasm",
        }
      }
    );
  }
};