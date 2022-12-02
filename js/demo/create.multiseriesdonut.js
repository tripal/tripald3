/**
 * Draws multi series donut chart in demo page.
 */

Drupal.behaviors.tripalD3demoMultiDonut = {
  attach: function (context, settings) {
    var multiDonutData = [
      {
        "label": "MarkerA",
        "parts": [
          {
            "label": "GG",
            "count": 16,
          },
          {
            "label": "AA",
            "count": 10,
          },
          {
            "label": "AG",
            "count": 2,
          },
        ],
      },
      {
        "label": "MarkerB",
        "parts": [
          {
            "label": "GG",
            "count": 145,
          },
          {
            "label": "AA",
            "count": 99,
          },
          {
            "label": "AG",
            "count": 19,
          },
        ],
      },
      {
        "label": "MarkerC",
        "parts": [
          {
            "label": "GG",
            "count": 78,
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
      multiDonutData,
      {
        "chartType" : "multidonut",
        "elementId": "tripald3-multidonut",
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

