<?php
/**
 *
 */
?>

<script type="text/javascript">
  Drupal.behaviors.stockPedigree = {
    attach: function (context, settings) {

      // The following code uses the Tripal D3 module to draw a pedigree tree
      // and attach it to an #tree element. Furthermore, it specifies a path
      // to get the data for the tree from.
      bioD3.drawPedigreeTree({
        "elementId": "tree",
        "dataJSONpath": "/dev/main/ajax/tripal/d3-json/relationships/stock/" + <?php print $node->stock->stock_id; ?>
      });
    }
  };
</script>

<div class="tripal_stock-data-block-desc tripal-data-block-desc"></div>
<!-- We need to create a div to attach our pedigree tree. -->
<!-- NOTE: The id used is specified above as the elementId of the tree to
     ensure that the tree can find where to attach itself. -->
<div id="tree"></div>
