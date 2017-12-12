
<?php

  // D3.js
  $library = libraries_load('d3');
  // If the library didn't load then provide an error to the admin.
  if (empty($library['loaded'])) {
    drupal_set_message('Unable to load D3.js. Please make sure you have downloaded D3.js and placed it in your libraries directory.', 'error');
    if (isset($library['error message'])) {
      drupal_set_message($library['error message'], 'error');
    }
  }

  // BioD3.js
  $path = drupal_get_path('module','tripald3');
  drupal_add_js($path . '/js/bioD3.js');

  // CSS.
  drupal_add_css($path . '/css/tripald3.css', array('group' => CSS_DEFAULT, 'type' => 'file'));

  // Settings.
  tripald3_register_colorschemes();
  $jsSettings['tripalD3']['autoResize'] = variable_get('tripald3_autoResize', FALSE);
  drupal_add_js($jsSettings, 'setting');
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

      // @todo figure out what we want to use here.
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
      // and attach it to an #tripald3-pedigree-diagram element.
      // Notice that the data for the tree is passed in directly.
      bioD3.drawPedigreeTree({
        "elementId": "tripald3-pedigree-diagram",
        "data": treedata,
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

<div id="tripald3-pedigree-diagram" class="tripald3-diagram">
  <!-- Javascript will add the Pedigree Diagram, Title and Figure legend here -->
</div>