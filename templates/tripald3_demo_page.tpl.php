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

<h3>Bottom-rooted relationship/hierarchy Diagram</h3>
<p>This diagram was initially developed to display parental pedigree information
  but can be used for any application where you would like to show relationship information.</p>

<script type="text/javascript">
  Drupal.behaviors.stockPedigree = {
    attach: function (context, settings) {

      // @todo move data into a separate file for better readability.
      var treedata = [
        {
          current: {
            stock_id: "1",
            name: "Heart Olive",
            uniquename: "GERM:1",
            nid: "1"
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
                nid: "2"
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
                    nid: "3"
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
              nid: "4"
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
                  nid: "2"
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
                      nid: "3"
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
                  nid: "5"
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

      // The following code uses the Tripal D3 module to draw a pedigree tree
      // and attach it to an #tripald3-pedigree element.
      // Notice that the data for the tree is passed in directly.
      tripalD3.drawFigure(
        treedata,
        {
          "chartType" : "pedigree",
          "elementId": "tripald3-pedigree",
          "height": 320,
          "title": "<em>Heart Olive</em> Parental Pedigree",
          "legend": "The above tree depicts the parentage of <em>Heart Olive</em>. The type of relationship is indicated both using line styles defined in the legend and also in sentence form when you hover your mouse over the relationship lines. Additional information about each germplasm can be obtained by clicking on the Germplasm name. Furthermore, parts of the pedigree diagram can be collapsed or expanded by double-clicking on a Germplasm node.",
        }
      );
    }
  };
</script>

<div id="tripald3-pedigree" class="tripald3-diagram">
  <!-- Javascript will add the Pedigree Diagram, Title and Figure legend here -->
</div>