/**
 * Draws pie chart in demo page.
 */

Drupal.behaviors.tripalD3demoSimplePie = {
  attach: function (context, settings) {
    var simplePieData = [
      {
        "label": "Accession",
        "count": 2390,
      },
      {
        "label": "Breeders Cross",
        "count": 567,
      },
      {
        "label": "Recombinant Inbred Line",
        "count": 115,
      },
      {
        "label": "Cultivated Variety",
        "count": 78,
      },
    ];

    // The following code uses the Tripal D3 module to draw a pie chart
    // and attach it to an #tripald3-simplepie element.
    // Notice that the data for the pie chart is passed in directly.
    tripalD3.drawFigure(
      simplePieData,
      {
        "chartType" : "simplepie",
        "elementId": "tripald3-simplepie",
        "height": 250,
        "width": 500,
        "keyPosition": "right",
        "title": "Proportion of <em>Tripalus databasica</em> Germplasm Types",
        "legend": "The above pie chart depicts the ratio of germplasm types available for <em>Tripalus databasica</em>.",
      }
    );

    // The following code uses the Tripal D3 module to draw a donut pie chart
    // and attach it to an #tripald3-simpledonut element.
    // Notice that the data for the donut pie chart is passed in directly.
    tripalD3.drawFigure(
      simplePieData,
      {
        "chartType" : "simpledonut",
        "elementId": "tripald3-simpledonut",
        "height": 250,
        "width": 500,
        "keyPosition": "left",
        "title": "Proportion of <em>Tripalus databasica</em> Germplasm Types",
        "legend": "The above pie chart depicts the ratio of germplasm types available for <em>Tripalus databasica</em>.",
      }
    );
  }
};