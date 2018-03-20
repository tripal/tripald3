/**
 * Draws diagrams to help explain pedigree relationship settings.
 */
Drupal.behaviors.TripalD3_pedigree_configForm = {
  attach: function (context, settings) {

    var width = 375;

    var examples = {
      'subject' : [
        {
          relPart: 'subject',
          exText: 'Fred',
          isParent: true
        },
        {
          relPart: 'type',
          exText: 'is paternal parent of'
        },
        {
          relPart: 'object',
          exText: 'Mary',
          isParent: false
        }
      ],
      'object' : [
        {
          relPart: 'subject',
          exText: 'Mary',
          isParent: false
        },
        {
          relPart: 'type',
          exText: 'is progeny of'
        },
        {
          relPart: 'object',
          exText: 'Fred',
          isParent: true
        }
      ],
    };

    /////////////////////////
    // #1 Sentence Diagram
    var drawSentenceDiagram = function(parent, data) {

      var svg = d3.select('.rel-settings-diagram.sentence.' + parent)
          .append("svg")
          .attr("width", width)
          .attr("height", 65)
          .append('g')
            .attr('transform', 'translate(50,0)');

      var sentenceParts = svg.selectAll('g')
          .data(data)
          .enter()
            .append('g')
              .attr('class', function(d) { return d.relPart; });

      // Keep track of the length of each relationship part.
      var subjectLen = 0, typeLen = 0, objectLen = 0;
      var lengthFn = function(d,i) {
        if (d.relPart == 'subject') {
          curLen = this.getComputedTextLength();
          if (curLen > subjectLen) {
            subjectLen = curLen;
          }
        } else if (d.relPart == 'type') {
          curLen = this.getComputedTextLength();
          if (curLen > typeLen) {
            typeLen = curLen;
          }
        } else if (d.relPart == 'object') {
          curLen = this.getComputedTextLength();
          if (curLen > objectLen) {
            objectLen = curLen;
          }
        }
      };

      // Use path to underline the example text.
      var underlineFn = function(d, height) {
        if (d.relPart == 'subject') {
          x0 = 0 - (subjectLen / 2);
          x1 = (subjectLen / 2);
        } else if (d.relPart == 'type') {
          x0 = 0 - (typeLen / 2);
          x1 = (typeLen / 2);
        } else if (d.relPart == 'object') {
          x0 = 0 - (objectLen / 2);
          x1 = (objectLen / 2);
        }
        return 'M'+x0+','+height
          +'L'+x1+','+height;
      };

      // Add the example text.
      sentenceParts.append('text')
        .classed('example-text', true)
        .text(function (d) { return d.exText; })
        .attr('y', 20)
        .attr("text-anchor", "middle")
        .attr('fill', 'blue')
        .each(lengthFn);

      // Add notation explaining the relationship parts.
      sentenceParts.append('text')
        .classed('relationship-parts', true)
        .text(function (d) { return d.relPart; })
        .attr('y', 40)
        .attr('font-style', 'italic')
        .attr("text-anchor", "middle")
        .each(lengthFn);

      // Add underline.
      // NOTE: doesn't just use the underline text-decoration because then it
      // wouldn't be the full length of the group.
      sentenceParts.append('path')
        .attr("d", function (d) { return underlineFn(d, 25); })
        .attr('stroke','#000');

      // Add box around the parent group
      svg.select('g.' + parent).append('rect')
        .attr('width', function(d,i) {
          if (d.relPart == 'subject') {
            return subjectLen + 10;
          } else if (d.relPart == 'object') {
            return objectLen + 10;
          }
        })
        .attr('height', 50)
        .attr('y',2)
        .attr('x', function(d,i) {
          if (d.relPart == 'subject') {
            return 0 - (subjectLen/2) -5;
          } else if (d.relPart == 'object') {
            return  0 - (objectLen/2) -5;
          }
        })
        .attr('fill', '#FFF')
        .attr('fill-opacity', 0.01)
        .attr('stroke', 'green')
        .attr('stroke-width', 2);

      // Label the parent.
      svg.select('g.' + parent).append('text')
        .text('Parent')
        .attr("text-anchor", "middle")
        .attr('font-weight', 'bold')
        .attr('y', 65)
        .attr('fill', 'green');

      // Adjust group lengths to match the computed width of the contained text.
      svg.selectAll('g')
        .attr('transform', function (d,i) {
          x = 0;
          if (d.relPart == 'subject') {
            x = (subjectLen / 2);
          } else if (d.relPart == 'type') {
            x = subjectLen + 20 + (typeLen / 2);
          } else if (d.relPart == 'object') {
            x = subjectLen + 20 + typeLen + 20 + (objectLen / 2);
          }
          return "translate(" + x + "," + 0 + ")";
        });

        // Adjust margin to center the diagram.
        fullLen = subjectLen + 20 + typeLen + 20 + objectLen;
        svg.attr('transform', function(d) { return 'translate(' + (width-fullLen-25)/2 + ',0)';});
    };

    drawSentenceDiagram('subject', examples.subject);
    drawSentenceDiagram('object', examples.object);

    /////////////////////////
    // #2 Tree Diagram
    var drawTreeDiagram = function(parent, data) {

      var nodeData = [
        {
          id: 'child',
          label: 'unknown',
          x: 150,
          y: 100,
          id: 0,
          inExample: true,
        },
        {
          id: 'parent1',
          label: 'unknown',
          x: 0,
          y: 0,
          id: 1,
          inExample: false,
        },
        {
          id: 'parent2',
          label: 'unknown',
          x: 300,
          y: 0,
          id: 2,
          inExample: true,
        }
      ];
      var linkData = [
        {
          source: nodeData[0],
          target: nodeData[1],
          inExample: false,
        },
        {
          source: nodeData[0],
          target: nodeData[2],
          inExample: true,
        }
      ];

      // Set labels to match the example.
      if (parent == 'subject') {
        nodeData[2].label = data[0].exText;
        nodeData[0].label = data[2].exText;
      } else {
        nodeData[2].label = data[2].exText;
        nodeData[0].label = data[0].exText;
      }

      var svg = d3.select('.rel-settings-diagram.tree.' + parent)
          .append("svg")
          .attr("width", width)
          .attr("height", 175)
          .append('g')
            .attr('transform', 'translate(30,25)');

      // Draw the links.
      var diagonal = function(d) {

        path = 'M' + d.source.x + ',' + d.source.y
          +'C' + d.source.x + ',' + (d.source.y - 60)
          +' ' + d.target.x + ',' + (d.target.y + 60)
          +' ' + d.target.x + ',' + d.target.y;

        return path;
      };

	    var link = svg.selectAll("path.link")
        .data(linkData)
        .enter()
          .insert("path", "g")
            .attr("d", diagonal)
            .attr('stroke', function(d) { if (d.inExample) { return '#000'; } else { return '#CCC'; }})
            .attr('stroke-width', 4)
            .attr('fill', '#FFF');

      // Draw the nodes.
      var nodes = svg.selectAll('g')
          .data(nodeData)
          .enter()
            .append('circle')
              .attr('r', 6)
              .attr('cx', function(d) { return d.x;})
              .attr('cy', function(d) { return d.y;})
              .attr('fill', '#FFF')
              .attr('stroke-width', 2)
              .attr('stroke', function(d) { if (d.inExample) { return '#000'; } else { return '#CCC'; }});

      var nodes = svg.selectAll('g')
          .data(nodeData)
          .enter()
            .append('text')
              .text(function(d) { return d.label; })
              .attr('y', function(d) {
                if (d.id == 0) {
                  return d.y + 18;
                } else {
                  return d.y - 10;
                }
              })
              .attr('x', function(d) { return d.x;})
              .attr('text-anchor', 'middle')
              .attr('fill', function(d) { if (d.inExample) { return '#000'; } else { return '#CCC'; }});

      // Add instructional mark-up :)
      var markup = svg.append('g')
        .classed('doc', true);

      // Note arrow is at the end, each param is expected to be an object with x, y
      var drawArrow = function(start, end, direction) {
        if (direction == 'up') {
          return 'M'+start.x+','+start.y
            +'L'+end.x+','+end.y
            +'L'+(end.x - 15)+','+(end.y + 15)
            +'M'+(end.x - 22)+','+(end.y + 3)
            +'L'+end.x+','+end.y;
        } else {
          return 'M'+start.x+','+start.y
            +'L'+end.x+','+end.y
            +'L'+(end.x + 15)+','+(end.y - 15)
            +'M'+(end.x + 22)+','+(end.y - 3)
            +'L'+end.x+','+end.y;
        }
      };

      arrowDirection = 'down';
      start = {'x': nodeData[2].x + 40, 'y': nodeData[2].y + 20};
      end = {'x': nodeData[0].x + 30, 'y': nodeData[0].y};
      if (parent == 'object') {
        arrowDirection = 'up';
        tmp = end;
        end = start;
        start = tmp;
      }
      markup.append('path')
        .attr('d', drawArrow(start, end, arrowDirection))
        .attr('stroke','green')
        .attr('stroke-width', 2)
        .attr('fill','#FFF');

    };

    drawTreeDiagram('subject', examples.subject);
    drawTreeDiagram('object', examples.object);
  }
};