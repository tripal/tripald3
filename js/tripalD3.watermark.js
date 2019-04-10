/**
 * @file
 * Add watermark to visualizations.
 */


/**
 * Add watermark to visualization.
 */
function tripalD3Watermark() {
  // Current path, url of the page user is viewing.
  var l = window.location.href;

  // Apply watermark when page has directory of:
  // Add more directory here where you want a watermark
  // where there's an svg.
  var dir = [
    'phenotypes',  // All of phenotypes/
    'LentilTraits' // All of LentilTraits/
    // Add directory here...
  ];

  var overlayId    = 'tripald3-watermark-overlay';
  // Rule definition in tripald3.css.
  var overlayClass = 'tripald3-watermark';
  var overlay      = '<div id="' + overlayId + '">&nbsp;</div>';

  dir.forEach(function(d) {
    if(l.indexOf(d) >= 0){
      // Found directory. Find SVG.
      if (jQuery('svg')) {
        // Begin watermark-ing.
        jQuery('svg').parent().append(overlay);
        jQuery('#' + overlayId).addClass(overlayClass);

        // Exit here.
        return;
      }
    }
  });

  return;
}


// Listen to page and stamp watermark:
jQuery(document).ready(function() {
  // Though this is in ready() we want to give
  // it a wait in case the svg is yet to be present in DOM.
  var waitLoad = setTimeout(function() {
    tripalD3Watermark();
    clearTimeout(waitLoad);
  }, 1000);
});
