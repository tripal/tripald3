
popover
=========

Add information popovers to any set of elements in a D3 diagram. By default the content of the popover will be the ``current.name`` of each node.

def ``popover(options)``:

  :options: A javascript object with any of the following keys:

    :diagramId: the ID of the element containing the svg diagram to attach the popovers to.

Functionality:

  :``popover.toggle(d)``: Toggle the visibility fo the popover.
  :``popover.show(d)``: Draw the popover for a given node.
  :``popover.hide(d)``: Hide the popover for a given node.
