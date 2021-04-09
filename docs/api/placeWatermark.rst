
placeWatermark
============
.. warning::

  Although this function places a watermark over diagrams, it is important to note that the watermark can be omitted with advance knowledge of HTML, CSS and DOM. Please be advised to take extra steps to achieve full restriction of content.``

This function places a watermark overlay to diagrams to indicate proprietary content/visualization in a page.

**Example Usage:**

.. code-block:: js

    // Draw.
    tripalD3.drawFigure(data, {'chartType' : 'multidonut', 'elementId' : 'multidonut', ....});

    // Watermark. Use default image in ``/templates/image/watermark.png`` as watermark.
    tripalD3.placeWatermark();

    // OR use alternate image.
    tripalD3.placeWatermark({
      'watermark' : 'http://www.mysite.ca/assets/logo-watermark.png',
    });


Source Code: ``js/tripalD3.js``

def ``placeWatermark(options)``:

  Called after drawFigure() instance.

  :options: A javascript object with the following key:

    :watermark: by default this function will use the image located in ``/templates/image/watermark.png`` as the preselected watermark. This can be
    used when site requires a unified watermark across all visualizations (site-wide), simply by replacing the said image with
    the desired logotype (be sure to use the same filename). If the site requires a different image for one diagram in a page to another
    diagram in another page, this option can be used to alter the default watermark by supplying a path to an image (see example).
