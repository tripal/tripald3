/**
 * Draws pie chart.
 */
Drupal.behaviors.tripalD3demoSimplePie = {
  attach: function (context, settings) {
    
    var data = drupalSettings.tripalD3.vars.simplePieData;
    data = JSON.parse(data);

    // Draw your chart.
    tripalD3.drawFigure(
      data,
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
  }
};