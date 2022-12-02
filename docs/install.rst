
Installation
==============

Quickstart
-----------

1. Unpack the `D3 v3 javascript library <https://github.com/d3/d3/releases/download/v3.5.14/d3.zip>`_ in your Drupal Libraries in sites/all/assets/vendor/ directory (quick check, you should have a sites/all/assets/vendor/d3/d3.min.js file; for more information see the drupal.org documentation).
2. Download and install this module as you would any other Drupal module.
3. (Optional) Go to Admin » Tripal » Extension Modules » Tripal D3 Diagrams to configure colour schemes, etc.

Dependencies
-------------

1. `Tripal 3.x <https://www.drupal.org/project/tripal>`_
2. `Drupal Libraries API <https://www.drupal.org/project/libraries>`_
3. `D3 v3 javascript library <https://github.com/d3/d3/releases/download/v3.5.14/d3.zip>`_

Drupal 8 Wiki
-------------

1. `Creating Custom Twig templates for custom modules <https://www.drupal.org/docs/theming-drupal/twig-in-drupal/create-custom-twig-templates-for-custom-module>`_
2. `Adding stylesheets (CSS) and JavaScript (JS) to a Drupal module <https://www.drupal.org/docs/creating-custom-modules/adding-stylesheets-css-and-javascript-js-to-a-drupal-module>`_
3. `Introductory Drupal 8 routes and controllers example https://www.drupal.org/docs/drupal-apis/routing-system/introductory-drupal-8-routes-and-controllers-example>`_

Installation
-------------

This installation guide assumes you already have a Tripal site. If not, see the `Tripal installation documentation <https://tripal.readthedocs.io/en/latest/user_guide/install_tripal.html>`_.

1. Install the Drupal libraries API

.. code:: bash

  drush pm-download libraries

2. Install this module.

.. code:: bash

  git clone https://github.com/tripal/tripald3.git
  drush pm-enable tripald3


Now that the module is installed, you can configure it to suit your needs or just get back to developing your custom field with easy to add diagrams.
