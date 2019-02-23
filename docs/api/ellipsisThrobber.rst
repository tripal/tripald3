
ellipsisThrobber
==================

Provides an infinite progress throbber in the form of an Ellipsis (3 dots).

**Example Usage:**

.. code-block:: js

    throbber = ellipsisThrobber(svg, {'left':50, 'top':50});
    setTimeout(function(){ throbber.remove() }, 3000);

Source Code: ``js/tripalD3.js``

def ``ellipsisThrobber(svg, dimensions)``:

  Created an infinite progress throbber.

  :svg: The svg canvas to draw the throbber on.
  :dimensions: An object specifying the left and top coordinates for the center of the throbber.

  :returns: The D3.js throbber object
