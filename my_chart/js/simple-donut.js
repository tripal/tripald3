/**
 * Draws pie chart.
 */
Drupal.behaviors.tripalD3demoSimpleDonut = {
  attach: function (context, settings) {
    
    var data = drupalSettings.tripalD3.vars.simpleDonutData;
    data = JSON.parse(data);

    // Draw your chart.
    tripalD3.drawFigure(
      data,
      {
        "chartType" : "simpledonut",
        "elementId": "tripald3-simpledonut",
        "height": 250,
        "width": 500,
        "keyPosition": "left",
        "title": "Proportion of <em>Tripalus databasica</em> Germplasm Types",
        "legend": "The above donut chart depicts the ratio of germplasm types available for <em>Tripalus databasica</em>.",
      }
    );
  }
};