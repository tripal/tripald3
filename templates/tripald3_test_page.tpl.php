<?php

  /**
   * Admin TripalD3 Test Page.
   *
   * This page tests the various figures available through this module.
   */

  // Load all the JS/CSS needed by this module.
  tripald3_load_libraries();
  // Additionally add the testing API.
  drupal_add_js(drupal_get_path('module','tripald3') . '/js/tripalD3.test.js');
?>

<script type="text/javascript">
  Drupal.behaviors.tripalD3testing = {
    attach: function (context, settings) {

      var numTests = 1;

      // First create our testing box mark-up.
      // Each test will have the following HTML.
      //  <div id="test1" class="test">
      //    <div id="test1-chart" class="chart"></div>
      //    <pre id="test1-data" class="data"></pre>
      //  </div>
      var page = d3.select("div.content");
      for(i=0; i<=numTests; i++) {
        var test = page.append("div")
          .attr("id", "test" + i)
          .attr("class", "test");
        test.append("div")
          .attr("id", "test"+i+"-chart")
          .attr("class", "chart");
        test.append("pre")
          .attr("id", "test"+i+"-data")
          .attr("class", "data");
      }

      // Test #0
      // All the ones that should break ;-P.
      d3.select("#test0 .data").html("<p>Tests associated with this block are expected to fail. As such you shouldn't see a chart in the box to the left and there should be errors in the developers console. Each error that is expected will be preceeded by a log message indicating such.</p><p><strong>Expect 33 Errors in Developers Console.</strong></p>");

      // Option chartType not supplied.
      console.log("Test #0: no chartType supplied. ERROR EXPECTED.");
      tripalD3.drawFigure(
        [],
        { "elementId": "test0-chart", }
      );

      // For all chart types...
      ['simplepie', 'simpledonut', 'multidonut', 'simplebar'].forEach(function(element) {

        // No Data.
        console.log("Test #0: " + element + " data = []. ERROR EXPECTED.");
        tripalD3.drawFigure(
          [],
          {
            "chartType" : element,
            "elementId": "test0-chart",
          }
        );

        // Data is an object not an array.
        console.log("Test #0: " + element + " data = object. ERROR EXPECTED.");
        tripalD3.drawFigure(
          {"not": "array", "bad": "data"},
          {
            "chartType" : element,
            "elementId": "test0-chart",
          }
        );

        // Remaining tests require data.
        var testData = tripalD3.test.randomSingleSeries(15, 1, 500);
        if (element == "multidonut") {
          testData = [{"label": "Series1", "parts": testData}];
        }
        console.log('Data for the following tests:');
        console.log(testData);

        // Option elementId not supplied and default element doesn't exist.
        console.log("Test #0: " + element + " no elementId; default elementId !exists. ERROR EXPECTED.");
        tripalD3.drawFigure(
          testData,
          {
            "chartType" : element,
          }
        );

        // Option elementId supplied but element doesn't exist.
        console.log("Test #0: " + element + " elementId supplied !exists. ERROR EXPECTED.");
        tripalD3.drawFigure(
          testData,
          {
            "chartType" : element,
            "elementId": "element-that-doesnt-exist",
          }
        );

        // Invalid width and/or height.
        console.log("Test #0: " + element + " string for width. ERROR EXPECTED.");
        tripalD3.drawFigure(
          testData,
          {
            "chartType" : element,
            "elementId": "test0-chart",
            "width": "500px",
          }
        );

        console.log("Test #0: " + element + " string for height. ERROR EXPECTED.");
        tripalD3.drawFigure(
          testData,
          {
            "chartType" : element,
            "elementId": "test0-chart",
            "height": "500px",
          }
        );

        // Invalid margin.
        console.log("Test #0: " + element + " string in margin. ERROR EXPECTED.");
        tripalD3.drawFigure(
          testData,
          {
            "chartType" : element,
            "elementId": "test0-chart",
            "margin": {
              "left": 20,
              "right": 20,
              "top": "20px",
              "bottom": 20,
            },
          }
        );
        console.log("Test #0: " + element + " margin missing parts. ERROR EXPECTED.");
        tripalD3.drawFigure(
          testData,
          {
            "chartType" : element,
            "elementId": "test0-chart",
            "margin": {
              "left": 20,
              "bottom": 20,
            },
          }
        );

        /*
        // Invalid draw key.
        console.log("Test #0: " + element + " string for drawKey. ERROR EXPECTED.");

        // Invalid key position.
        console.log("Test #0: " + element + " unsupported keyPosition. ERROR EXPECTED.");

        // Invalid key width.
        console.log("Test #0: " + element + " string for keyWidth. ERROR EXPECTED.");
        console.log("Test #0: " + element + " keyWidth > svg width. ERROR EXPECTED.");

        // Invalid key margin.
        console.log("Test #0: " + element + " string in key margin. ERROR EXPECTED.");
        console.log("Test #0: " + element + " key margin missing parts. ERROR EXPECTED.");
        */

      });

      // Test #1
      // Simple Pie Chart: 15 categories, count 1-500
      console.log("Test #1: Simple Pie Chart: 15 categories, count 1-500.");
      var testData = tripalD3.test.randomSingleSeries(15, 1, 500);
      console.log(testData);
      d3.select("#test1 .data").html(JSON.stringify(testData, null,2));

      tripalD3.drawFigure(
        testData,
        {
          "chartType" : "simplepie",
          "elementId": "test1-chart",
          "height": 250,
          "width": 500,
          "keyPosition": "right",
          "title": "Test #1: Simple pie chart",
          "legend": "This pie chart should have 15 categories which ensures that your colour scheme will be repeated. Furthermore, the chart is only 250px tall, which means the key won't fit at the default font size. The counts range from 1-500 with no zeros and are randomly generated. The data is shown to the right and printed to the 'Developers Console'.",
        }
      );
    }
  };
</script>

<style>
  div.test, pre.data, div.chart {
    border: 1px solid #e0e0d8;
  }
  div.test {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    height: 400px;
  }
  div.test div.chart {
    padding: 15px;
  }
  div.test pre {
    margin: 0;
    overflow: scroll;
    font-size: 10px;
    flex-grow: 1;
  }
  div.test svg {
    border: 1px solid #e0e0d8;
  }
  div#test0 {
    height: 100px;
  }
  div#test0 .data {
    color: red;
  }
</style>