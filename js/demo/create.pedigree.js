/**
 * Draws pedigree diagram in demo page.
 */

Drupal.behaviors.tripalD3demoPedigree = {
  attach: function (context, settings) {
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