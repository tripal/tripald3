<?php
/**
 *
 */
?>
<h2 align="center" style="color:red;">EXPERIMENTAL</h2>
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
        "popoverContent": function (popover, d) {
                var body = popover.append('text')
                  .attr('dy', '0.4em')
                  .attr('font-size', '15')
                  .attr('x', popover.left + 10)
                  .attr('y', popover.top + 25 + 10);
                firstLine = body.append('tspan')
                  .attr('x', popover.left + 10)
                  .attr('y', popover.top + 25 + 13 + (18 * 0))
                  .attr('dy', '0.4em')
                  .attr('font-size', 12)
                  .attr('font-family','Verdana')
                if (d.current.nid) {
                  firstLine
                    .attr('text-decoration', 'underline')
                    .append('a')
                      .attr('xlink:href',
                        Drupal.settings.basePath + 'node/'
                        + d.current.nid)
                      .attr('target','_blank')
                    .text(d.current.uniquename);
                } else {
                  firstLine.text(d.current.uniquename);
                }
                body.append('tspan')
                  .attr('x', popover.left + 10)
                  .attr('y', popover.top + 25 + 13 + (18 * 1))
                  .attr('dy', '0.4em')
                  .attr('font-size', 12)
                  .attr('font-family','Verdana')
                  .attr('font-style','italic')
                  .text(d.current.organism_id.genus + ' '
                    + d.current.organism_id.species);
                body.append('tspan')
                  .attr('x', popover.left + 10)
                  .attr('y', popover.top + 25 + 13 + (18 * 2))
                  .attr('dy', '0.4em')
                  .attr('font-size', 12)
                  .attr('font-family','Verdana')
                  .text(d.current.type_id.name);
        }
      });
    }
  };
</script>

<div class="tripal_stock-data-block-desc tripal-data-block-desc"></div>

<!-- We need to create a div to attach our pedigree tree. -->
<!-- NOTE: The id used is specified above as the elementId of the tree to
     ensure that the tree can find where to attach itself. -->
<div id="tripald3-diagram">
  <div id="tree"></div>
  <div class="sidebar content-sidebar-bottom">

    <div id="block-menu-menu-tree-legend" class="block block-menu contextual-links-region">
      <h2>Legend</h2>
      <div id="legend" class="content">
      </div>
    </div>

    <div id="block-menu-menu-tree-description" class="block block-menu contextual-links-region">
      <h2>Description</h2>
      <div id="description" class="content">
      <p>The above tree depicts the parentage of <em><?php print $node->stock->name; ?></em> where each germplasm involved is indicated using a "Germplasm Node" and the relationships between the germplasm are represented as lines connecting Germplasm nodes. Specifically the type of relationship is indicated both using line styles defined in the legend to the right and also in sentence form when you hover your mouse over the relationship lines. <strong><em>Additional information about each germplasm can be obtained by clicking on a Germplasm node</em></strong>. Furthermore, parts of the pedigree diagram can be collapsed or expanded (depending on the state) by double-clicking on a Germplasm node.</p>
      <p>See the legend to the right for a visual reference of the types of relationships shown in the pedigree diagram above.</p>
      </div>
    </div>

  </div>
</div>