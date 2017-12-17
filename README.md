# Tripal d3.js API
Provides d3.js integration for Tripal. It provides an API for developing consistent
biological diagrams with a common configuration, as well as, providing some
common diagrams such as pie, bar, column and pedigree diagrams.

**NOTE:** This module is an API and does not provide user facing diagrams.
Rather, you would develop your own diagrams. Diagram functionality is
demonstrated at Admin » Tripal » Extension Modules » Tripal D3 Diagrams » Demo.

## Installation & Setup
1. Download the [D3 v3 javascript library](http://d3js.org/) (quick check, you should have a libraries/d3/d3.min.js file; for more information see the [drupal.org documentation](https://www.drupal.org/node/1440066))
2. Download and install this module as you would any other Drupal module ([Documentation](https://www.drupal.org/documentation/install/modules-themes))
3. Go to Admin » Tripal » Extension Modules » Tripal D3 Diagrams to
configure colour schemes, etc. All configuration is optional.

## Browser Support
All Diagrams Tested on:
- Chrome 40.0.2214.111
- Firefox 35.0.1
- Safari 8.0.2
- Internet Explorer 11

## Diagrams
All of the following diagrams are presented to the user as a "Figure" with the
title and description below the diagram in the style of scientific journals.
Furthermore, all diagrams have a consistent, configurable colour scheme and key.
- Simple Pie Chart
- Donut Pie Chart
- Pedigree Diagram

## Documentation
Documentation is currently available in the Javascript files for each diagram. 
Furthermore, there are examples on how to use each chart in `templates/tripald3_demo_page.tpl.php`. 
Before release I will develop documentation in the Wiki as well.

## Future Work
- Add additional diagrams including:
   - Multi-ring Pie Chart
   - Bar Chart
   - Column Chart
