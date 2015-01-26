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

      // The following code uses the Tripal D3 module to draw a pedigree tree
      // and attach it to an #tree element. Furthermore, it specifies a path
      // to get the data for the tree from.
      bioD3.drawPedigreeTree({
        "elementId": "tree",
        "dataJSONpath": jsonurl,
        "height": 800,
        "nodeURL": function(d) {
          if (d.current.nid) {
            return Drupal.settings.basePath + 'node/' + d.current.nid;
          }
          else {
            return null;
          }
        }
      });
    }
  };
</script>

<div class="tripal_stock-data-block-desc tripal-data-block-desc"></div>

<div id="tripald3-diagram">

  <!-- We need to create a div to attach our pedigree tree. -->
  <!-- NOTE: The id used is specified above as the elementId of the tree to
       ensure that the tree can find where to attach itself. -->
  <div id="tree"></div>

  <!-- Add the Description/Legend in a KnowPulse theme-like manner -->
  <div class="sidebar content-sidebar-bottom">

    <!-- Legend -->
    <!-- NOTE: The legend is added by the bioD3.drawPedigreeTree js function
         and where it is added is hard-coded as the element with #legend -->
     <div id="block-menu-menu-tree-legend" class="block block-menu contextual-links-region">
      <h2>Legend</h2>
      <div id="legend" class="content">
      </div>
    </div>

    <!-- Description -->
    <!-- NOTE: This is just information to the user which makes
         the legend not look out of place. -->
    <div id="block-menu-menu-tree-description" class="block block-menu contextual-links-region">
      <h2>Description</h2>
      <div id="description" class="content">
      <p>The above tree depicts the parentage of <em><?php print $node->stock->name; ?></em> where each germplasm involved is indicated using a "Germplasm Node" and the relationships between the germplasm are represented as lines connecting Germplasm nodes. Specifically the type of relationship is indicated both using line styles defined in the legend to the right and also in sentence form when you hover your mouse over the relationship lines. <strong><em>Additional information about each germplasm can be obtained by clicking on a Germplasm node</em></strong>. Furthermore, parts of the pedigree diagram can be collapsed or expanded (depending on the state) by double-clicking on a Germplasm node.</p>
      <p>See the legend to the right for a visual reference of the types of relationships shown in the pedigree diagram above.</p>
      </div>
    </div>

  </div>
</div>