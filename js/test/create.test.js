/**
 * Creates test page.
 */

var initialize = false;

Drupal.behaviors.tripalD3testing = {
  attach: function (context, settings) {
    if(!initialize) {
      tripald3CreateTestPage();
    }
    
    initialize = true;
  }
};


// Functions.


function tripald3CreateTestPage() {
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
  //===================================================
  d3.select("#test0 .data").html("<p>Tests associated with this block are expected to fail. As such you shouldn't see a chart in the box to the left and there should be errors in the developers console. Each error that is expected will be preceeded by a log message indicating such.</p>"
    + "<p><strong>Expect 68 Errors in Developers Console.</strong></p>");

  // Option chartType not supplied.
  console.log("Test #0: no chartType supplied. ERROR EXPECTED.");
  tripalD3.drawFigure(
    [],
    { "elementId": "test0-chart", }
  );

  // Check general options for all chart types...
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

    // Invalid draw key.
    console.log("Test #0: " + element + " string for drawKey. ERROR EXPECTED.");
    tripalD3.drawFigure(
      testData,
      {
        "chartType" : element,
        "elementId": "test0-chart",
        "drawKey": "no-shit-sherlock",
      }
    );

    // Invalid key position.
    console.log("Test #0: " + element + " unsupported keyPosition. ERROR EXPECTED.");
    tripalD3.drawFigure(
      testData,
      {
        "chartType" : element,
        "elementId": "test0-chart",
        "keyPosition": "top right",
      }
    );

    // Invalid key width.
    console.log("Test #0: " + element + " string for keyWidth. ERROR EXPECTED.");
    tripalD3.drawFigure(
      testData,
      {
        "chartType" : element,
        "elementId": "test0-chart",
        "keyWidth": "250px",
      }
    );
    console.log("Test #0: " + element + " keyWidth > svg width. ERROR EXPECTED.");
    tripalD3.drawFigure(
      testData,
      {
        "chartType" : element,
        "elementId": "test0-chart",
        "width": 50,
        "keyWidth": 250,
      }
    );

    // Invalid key margin.
    console.log("Test #0: " + element + " string in key margin. ERROR EXPECTED.");
    tripalD3.drawFigure(
      testData,
      {
        "chartType" : element,
        "elementId": "test0-chart",
        "key": {
          "margin": {
            "left": 20,
            "right": 20,
            "top": "20px",
            "bottom": 20,
          },
        },
      }
    );
    console.log("Test #0: " + element + " key margin missing parts. ERROR EXPECTED.");
    tripalD3.drawFigure(
      testData,
      {
        "chartType" : element,
        "elementId": "test0-chart",
        "key": {
          "margin": {
            "left": 20,
            "right": 20,
            "bottom": 20,
          },
        },
      }
    );

    // Check simplepie, simpledonut and simplebar data compliance.
    if (element == 'simplepie' || element == 'simpledonut' || element == 'simplebar') {
      // Already checked that data is a non-empty array.
      // Check that each element must have a label & count.
      // Semi-deep clone testData 2X.
      var dataMissingLabel = [];
      var dataMissingCount = [];
      testData.forEach(function(element) {
        var newElement1 = Object.assign({}, element);
        dataMissingLabel.push(newElement1);
        var newElement2 = Object.assign({}, element);
        dataMissingCount.push(newElement2);
      });
      console.log("Test #0: " + element + " data missing label (3rd element). ERROR EXPECTED.");
      delete dataMissingLabel[2].label;
      tripalD3.drawFigure(
        dataMissingLabel,
        {
          "chartType": element,
          "elementId": "test0-chart",
        }
      );
      console.log("Test #0: " + element + " data missing count (4th element). ERROR EXPECTED.");
      delete dataMissingCount[3].count;
      tripalD3.drawFigure(
        dataMissingCount,
        {
          "chartType": element,
          "elementId": "test0-chart",
        }
      );
    }
    // Check simplepie, simpledonut and simplebar data compliance.
    if (element == 'multidonut') {
      // Already checked that data is a non-empty array.
      // Check that each element must have a label & count.
      // Semi-deep clone testData.parts array 2X.
      var dataMissingLabel = [];
      var dataMissingCount = [];
      testData[0].parts.forEach(function(element) {
        var newElement1 = Object.assign({}, element);
        dataMissingLabel.push(newElement1);
        var newElement2 = Object.assign({}, element);
        dataMissingCount.push(newElement2);
      });
      console.log("Test #0: " + element + " data missing series label. ERROR EXPECTED.");
      tripalD3.drawFigure(
        [{
          "parts": testData,
        }],
        {
          "chartType": element,
          "elementId": "test0-chart",
        }
      );
      console.log("Test #0: " + element + " data missing parts array. ERROR EXPECTED.");
      tripalD3.drawFigure(
        [{
          "label": "Series1",
        }],
        {
          "chartType": element,
          "elementId": "test0-chart",
        }
      );
      console.log("Test #0: " + element + " data empty parts array. ERROR EXPECTED.");
      tripalD3.drawFigure(
        [{
          "label": "Series1",
          "parts": [],
        }],
        {
          "chartType": element,
          "elementId": "test0-chart",
        }
      );
      console.log("Test #0: " + element + " data missing label in parts array (3rd element). ERROR EXPECTED.");
      delete dataMissingLabel[2].label;
      tripalD3.drawFigure(
        [{
          "label" : "Series1",
          "parts": dataMissingLabel,
        }],
        {
          "chartType": element,
          "elementId": "test0-chart",
        }
      );
      console.log("Test #0: " + element + " data missing count in parts array (4th element). ERROR EXPECTED.");
      delete dataMissingCount[3].count;
      tripalD3.drawFigure(
        [{
          "label" : "Series1",
          "parts": dataMissingCount,
        }],
        {
          "chartType": element,
          "elementId": "test0-chart",
        }
      );
    }
  }); // End of for each chart type.

  // @todo Check multidonut data compliance.

  // Test #1
  // Simple Pie Chart: 15 categories, count 1-500
  // Check that the full key is displayed and that categories are still
  // distinguisable when there are more then 9.
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

  // See what happens with 0 count categories.
}