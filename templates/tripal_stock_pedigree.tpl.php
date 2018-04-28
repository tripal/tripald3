<?php

/**
 * This template adds a "pedigree" pane to stock pages.
 *
 * Specifically, this pane displays a d3.js pedigree diagram based on the
 * chado.stock and chado.stock_relationship data stored for the current stock.
 *
 * NOTE: Relationship information is available in JSON at
 *  [Your Drupal Site]/ajax/tripal/d3-json/relationships/stock/[root stock_id]
 */?>

<script type="text/javascript">
  Drupal.behaviors.stockPedigree = {
    attach: function (context, settings) {

      jsonurl = <?php print '"' . url('ajax/tripal/d3-json/relationships/stock/' . $node->stock->stock_id) . '"'; ?>;

      jQuery.getJSON(jsonurl, function(data) {


        // Calculate the height of the diagram based on the depth of the tree.
        // Assumption: distance between nodes is ~75px
        getDepth = function (obj) {
          var depth = 0;
          if (obj.children) {
              obj.children.forEach(function (d) {
                  var tmpDepth = getDepth(d)
                  if (tmpDepth > depth) {
                      depth = tmpDepth
                  }
              })
          }
          return 1 + depth
        }
        maxDepth = getDepth(data[0]);

        // Calculate the width of the diagram based on the overview pane.
        // We need to do this b/c the hidden div that will contain the tree
        // has width=0 at this point ;-P.
        width = document.getElementById('base-tripal-data-pane').offsetWidth;
        console.log(width);

        // The following code uses the Tripal D3 module to draw a pedigree tree
        // and attach it to an #tree element. Furthermore, it specifies a path
        // to get the data for the tree from.
        tripalD3.drawFigure(
          data,
          {
            "chartType" : "pedigree",
            "elementId": "tripald3-pedigree",
            "height": 75 * maxDepth,
            "width": width - 250,
            "chartOptions" : {
              "nodeLinks": function(d) {
                if (d.current.nid) {
                  return Drupal.settings.basePath + 'node/' + d.current.nid;
                }
                else {
                  return null;
                }
              },
            },
            "title": "<em><?php print $node->stock->name; ?></em> Parental Pedigree",
            "legend": "The above tree depicts the parentage of <em><?php print $node->stock->name; ?></em>. The type of relationship is indicated both using line styles defined in the legend and also in sentence form when you hover your mouse over the relationship lines. Additional information about each germplasm can be obtained by clicking on the Germplasm name. Furthermore, parts of the pedigree diagram can be collapsed or expanded by double-clicking on a Germplasm node."
        });
      });
    }
  };
</script>

<div class="tripal_stock-data-block-desc tripal-data-block-desc"></div>

  <!-- We need to create a div to attach our pedigree tree. -->
  <!-- NOTE: The id used is specified above as the elementId of the tree to
       ensure that the tree can find where to attach itself. -->
  <div id="tripald3-pedigree" class="tripald3-diagram">
  </div>

</div>
