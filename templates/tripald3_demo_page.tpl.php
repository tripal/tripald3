<?php

  /**
   * Admin TripalD3 Demo Page.
   *
   * This page demonstrates the various figures available through this module.
   * It can be used to confirm you have correclty installed the module, as well
   * as, provide example code demonsrating how to create your own digrams.
   */

  // Load all the JS/CSS needed by this module.
  tripald3_load_libraries();
?>

<h2>Demonstrations</h2>

<p>This page demonstrates the various diagrams available through this module.
  Remember that this module simply provides an API to develop common diagrams
  and, as such, none of these diagrams are available to your users without
  you first developing pages or fields that connect data to them.</p>

<!--------  PIE CHARTS ------------------------------------------------------->
<h3>Watermark Diagram</h3>
<p>This example shows a pie chart that has watermark overlay to visually indicate proprietary content.</p>


<script type="text/javascript">
  Drupal.behaviors.tripalD3demoMultiDonut22 = {
    attach: function (context, settings) {

      // @todo move data into a separate file for better readability.
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

      tripalD3.placeWatermark();
    }
  };
</script>

<div id="tripald3-multidonut2" class="tripald3-diagram">
  <!-- Javascript will add the Simple Pie Chart, Title and Figure legend here -->
</div>

<br />



<h3>Simple Pie Chart</h3>
<p>This following two figures are simple pie charts ideal for showing proportions or ratios. The first is a traditional pie chart and the second is a donut chart.</p>

<script type="text/javascript">
  Drupal.behaviors.tripalD3demoSimplePie = {
    attach: function (context, settings) {

      // @todo move data into a separate file for better readability.
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
</script>

<div id="tripald3-simplepie" class="tripald3-diagram">
  <!-- Javascript will add the Simple Pie Chart, Title and Figure legend here -->
</div>

<br />

<div id="tripald3-simpledonut" class="tripald3-diagram">
  <!-- Javascript will add the Simple Donut Chart, Title and Figure legend here -->
</div>

<br />

<h3>Multi-series Donut Chart</h3>
<p>The following chart allows users to compare the ratios between multiple
series of data.</p>

<script type="text/javascript">
  Drupal.behaviors.tripalD3demoMultiDonut = {
    attach: function (context, settings) {

      // @todo move data into a separate file for better readability.
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
</script>

<div id="tripald3-multidonut" class="tripald3-diagram">
  <!-- Javascript will add the Multiple Series Donut Chart, Title and Figure legend here -->
</div>

<!--------  BAR CHART -------------------------------------------------------->
<h3>Simple Bar Chart</h3>
<p></p>

<script type="text/javascript">
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
</script>

<div id="tripald3-barchart" class="tripald3-diagram">
  <!-- Javascript will add a Simple Bar Chart, Title and Figure legend here -->
</div>


<!--------  HISTOGRAM  -------------------------------------------------------->
<h3>Histogram With Interactive Thresholds</h3>
<p></p>

<script type="text/javascript">
  Drupal.behaviors.tripalD3demoHistogram = {
    attach: function (context, settings) {

      // Pull the data out of the javascript settings.
      var histoData = [
        d3.range(5000).map(d3.random.normal(0, 50));
      ];

      // Draw your chart.
      tripalD3.drawFigure(
        histoData,
        {
          "chartType" : "histogram",
          "elementId": "tripald3-histogram",
          "height": 500,
          "width": 1000,
          "keyPosition": "right",
          "title": "SNPs available for the selection of <em>Tripalus databasica</em>",
          "legend": "The above histogram depicts the number of SNPs available per selected tree for <em>Tripalus databasica</em>.",
          "chartOptions": {
            "xAxisTitle": "",
            "yAxisTitle": "",
          }
        }
      );
    }
  };
</script>

<div id="tripald3-histogram" class="tripald3-diagram">
  <!-- Javascript will add a Histogram, Title and Figure legend here -->
</div>


<!--------  SIMPLE HISTOGRAM  -------------------------------------------------------->
<h3>Simple Histogram</h3>
<p></p>

<script type="text/javascript">
  Drupal.behaviors.tripalD3demoSimpleHistogram = {
    attach: function (context, settings) {

      // Pull the data out of the javascript settings.
      var simpleHistoData = [
        d3.range(5000).map(d3.random.normal(0, 50));
      ];

      // Draw your chart.
      tripalD3.drawFigure(
        simpleHistoData,
        {
          "chartType" : "simpleHistogram",
          "elementId": "tripald3-simpleHistogram",
          "height": 500,
          "width": 1000,
          "keyPosition": "right",
          "title": "SNPs available for the selection of <em>Tripalus databasica</em>",
          "legend": "The above histogram depicts the number of SNPs available per selected tree for <em>Tripalus databasica</em>.",
          "chartOptions": {
            "xAxisTitle": "",
            "yAxisTitle": "",
          }
        }
      );
    }
  };
</script>

<div id="tripald3-histogram" class="tripald3-diagram">
  <!-- Javascript will add a Simple Histogram, Title and Figure legend here -->
</div>


<!--------  PEDIGREE DIAGRAM ------------------------------------------------->
<h3>Pedigree Diagram</h3>
<p>This diagram was developed to mimic plant breeder pedigrees with additional
  features such as collapsible nodes and colour-coded relationships.</p>

<script type="text/javascript">
  Drupal.behaviors.tripalD3demoPedigree = {
    attach: function (context, settings) {

      // @todo move data into a separate file for better readability.
      var treedata = [
        {
          current: {
            stock_id: "1",
            name: "Heart Olive",
            uniquename: "GERM:1",
            url: "/bio_data/1"
          },
          parent: {
            stock_id: "null",
            name: "null"
          },
          children: [
            {
              current: {
                stock_id: "2",
                name: "Wild Cress",
                uniquename: "GERM:2",
                url: "/bio_data/2"
              },
              parent: {
                parent_id: "1",
                name: "Heart Olive"
              },
              relationship: {
                subject_id: "1",
                type_id: "1",
                type: "is maternal parent of",
                object_id: "2",
                subject: "Wild Cress",
                object: "Heart Olive"
              },
              children: [
                {
                  current: {
                    stock_id: "3",
                    name: "Spring Leek",
                    uniquename: "GERM:3",
                    url: "/bio_data/3"
                  },
                  parent: {
                    parent_id: "2",
                    name: "Wild Cress"
                  },
                  relationship: {
                    subject_id: "2",
                    type_id: "2",
                    type: "is selection of",
                    object_id: "3",
                    object: "Spring Leek",
                    subject: "Wild Cress"
                  },
                  children: [ ]
                }
              ]
            },
          {
            current: {
              stock_id: "4",
              name: "Mountain Olive",
              uniquename: "GERM:4",
              url: "/bio_data/4"
            },
            parent: {
              parent_id: "1",
              name: "Heart Olive"
            },
            relationship: {
              subject_id: "4",
              type_id: "3",
              type: "is paternal parent of",
              object_id: "1",
              subject: "Mountain Olive",
              object: "Heart Olive"
            },
            children: [
              {
                current: {
                  stock_id: "2",
                  name: "Wild Cress",
                  uniquename: "GERM:2",
                  url: "/bio_data/2"
                },
                parent: {
                  parent_id: "4",
                  name: "Mountain Olive"
                },
                relationship: {
                  subject_id: "2",
                  type_id: "1",
                  type: "is maternal parent of",
                  object_id: "4",
                  subject: "Wild Cress",
                  object: "Mountain Olive"
                },
                children: [
                  {
                    current: {
                      stock_id: "3",
                      name: "Spring Leek",
                      uniquename: "GERM:3",
                      url: "/bio_data/3"
                    },
                    parent: {
                      parent_id: "2",
                      name: "Wild Cress"
                    },
                    relationship: {
                      subject_id: "2",
                      type_id: "2",
                      type: "is selection of",
                      object_id: "3",
                      object: "Spring Leek",
                      subject: "Wild Cress"
                    },
                    children: [ ]
                  }
                ]
              },
              {
                current: {
                  stock_id: "5",
                  name: "Tiger Parsley",
                  uniquename: "GERM:5",
                },
                parent: {
                  parent_id: "4",
                  name: "Mountain Olive"
                },
                relationship: {
                  subject_id: "5",
                  type_id: "3",
                  type: "is paternal parent of",
                  object_id: "4",
                  subject: "Tiger Parsley",
                  object: "Mountain Olive"
                },
                children: [ ]
              }
            ]
          }
        ]
      }
    ];
    var treedata2 = JSON.parse(JSON.stringify(treedata));

      // The following code uses the Tripal D3 module to draw a pedigree tree
      // and attach it to an #tripald3-pedigree element.
      // Notice that the data for the tree is passed in directly.
      tripalD3.drawFigure(
        treedata,
        {
          "chartType" : "pedigree",
          "elementId": "tripald3-pedigree",
          "height": 320,
	  "keyPosition" : "top",
          "collapsedDepth": 1,
          "title": "<em>Heart Olive</em> Parental Pedigree",
          "legend": "The above tree depicts the parentage of <em>Heart Olive</em>. The type of relationship is indicated both using line styles defined in the legend and also in sentence form when you hover your mouse over the relationship lines. Additional information about each germplasm can be obtained by clicking on the Germplasm name. Furthermore, parts of the pedigree diagram can be collapsed or expanded by double-clicking on a Germplasm node.",
        }
      );

      tripalD3.drawFigure(
        treedata2,
        {
          "chartType" : "pedigree",
          "elementId": "tripald3-pedigree-right",
          "height": 320,
          "keyPosition" : "right",
          "title": "<em>Heart Olive</em> Parental Pedigree",
          "legend": "The above tree depicts the parentage of <em>Heart Olive</em>. The type of relationship is indicated both using line styles defined in the legend and also in sentence form when you hover your mouse over the relationship lines. Additional information about each germplasm can be obtained by clicking on the Germplasm name. Furthermore, parts of the pedigree diagram can be collapsed or expanded by double-clicking on a Germplasm node.",
        }
      );
    }
  };
</script>

<h4>Pedigree with keyPosition top</h4>
<div id="tripald3-pedigree" class="tripald3-diagram">
  <!-- Javascript will add the Pedigree Diagram, Title and Figure legend here -->
</div>

<h4>Pedigree with keyPosition right</h4>
<div id="tripald3-pedigree-right" class="tripald3-diagram">
  <!-- Javascript will add the pedigree diagram and figure legend here -->
</div>
