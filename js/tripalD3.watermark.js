/**
 * @file
 * Add watermark to visualizations.
 */

var stampCount = 0;
var reqAJAX = false;

// Listen to page for SVGs and stamp watermark each:
jQuery(document).ready(function() {
  // Apply watermark:
  // Set to true to watermark visualizations.
  var applyWatermark = true;

  if (applyWatermark) {
    tripalD3DelayWatermark();

    // Listen to select boxes wanting to add another svg-visuals:
    jQuery('#content select').change(function() {
      tripalD3DelayWatermark();

      jQuery(document).ajaxComplete(function() {
        reqAJAX = true;
        tripalD3DelayWatermark();
      });
    });

  }
});


/**
 * Add watermark to visualization.
 */
function tripalD3Watermark() {
  // Current path, url of the page user is viewing.
  var l = window.location.href.toLowerCase();

  // Apply watermark when page has directory of:
  // Add more directory here where you want a watermark
  // where there's an svg.

  // In lowercase:
  var dir = [
    'phenotypes',   // All of phenotypes/
    'lentiltraits', // All of LentilTraits/
    'f1',
    'cicer',
    'demo',
    // Add directory here...
  ];


  // Each page see if you are looking at any one.
  dir.forEach(function(d) {
    if(l.indexOf(d.toLowerCase()) >= 0){
      // Found directory. Find SVG.
      if (jQuery('svg')) {
        // Begin watermark-ing.

        // Find all svg and stamp.
        jQuery('svg').each(function(i) {
          var overlayId    = 'tripald3-watermark-overlay' + i;
          // Rule definition in tripald3.css.
          var overlayClass = 'tripald3-watermark';
          var overlay      = '<div id="' + overlayId + '">&nbsp;</div>';

          jQuery(this).parent().css('position', 'relative').append(overlay);
          jQuery('#' + overlayId).addClass(overlayClass);

          stampCount++;
        });

        // Exit here. No need to check other pages.
        return;
      }
    }
  });

  return stampCount;
}


/**
 * Delay watermark to account for SVG added through
 * AJAX call or by append().
 */
function tripalD3DelayWatermark() {
  var stamped;

  stamped = tripalD3Watermark();

  if (reqAJAX) {
    // AJAX takes back watermark, try restamping...
    stamped = 0;
    reqAJAX = false;
  }

  if (stamped > 0) {
    // When watermark applied, Stop watermark.
    clearTimeout(waitLoad);
  }
  else {
    // Wait, try again, maybe AJAX is adding the svg.
    var waitLoad = setTimeout(tripalD3DelayWatermark, 500);
  }
}
