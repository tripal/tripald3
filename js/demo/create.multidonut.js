/**
 * Draws multidonut chart in demo page.
 */

var initialize = false;

Drupal.behaviors.tripalD3demoMultiDonut22 = {
  attach: function (context, settings) {       
    // Sample Data.
    var multiDonutData2 = [
      {
        "label": "MarkerX",
        "parts": [
          {
            "label": "GG",
            "count": 11,
          },
          {
            "label": "AA",
            "count": 5,
          },
          {
            "label": "AG",
            "count": 2,
          },
        ],
      },
      {
        "label": "MarkerY",
        "parts": [
          {
            "label": "GG",
            "count": 140,
          },
          {
            "label": "AA",
            "count": 94,
          },
          {
            "label": "AG",
            "count": 19,
          },
        ],
      },
      {
        "label": "Markerz",
        "parts": [
          {
            "label": "GG",
            "count": 73,
          },
          {
            "label": "AA",
            "count": 73,
          },
        ],
      },
    ];

    // The following code uses the Tripal D3 module to draw a multi-series chart
    // and attach it to an #tripald3-multidonut element.
    // Notice that the data for the pie chart is passed in directly.
    tripalD3.drawFigure(
      multiDonutData2,
      {
        "chartType" : "multidonut",
        "elementId": "tripald3-multidonut2",
        "height": 250,
        "width": 650,
        "keyPosition": "left",
        "title": "Comparison of allele calls across 3 FBA-1 markers",
        "legend": "The above chart shows the allele ratios for three seperate markers assaying the FBA-1 (fictional but amazing) gene.",
        "key": {"title": "Alleles"},
      }
    );
    
    if (!initialize) {
      tripalD3.placeWatermark();
    }

    initialize = true;
  ///
  }
};

