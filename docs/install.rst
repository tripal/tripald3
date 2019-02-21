
Installation
==============

Quickstart
-----------

1. Unpack the `D3 v3 javascript library <https://github.com/d3/d3/releases?after=v4.0.0>`_ in your Drupal Libraries directory (quick check, you should have a libraries/d3/d3.min.js file; for more information see the drupal.org documentation).
2. Download and install this module as you would any other Drupal module (`Documentation <https://www.drupal.org/documentation/install/modules-themes>`_)
3. (Optional) Go to Admin » Tripal » Extension Modules » Tripal D3 Diagrams to configure colour schemes, etc.

Dependencies
-------------

1. `Tripal 3.x <https://www.drupal.org/project/tripal>`_
2. `Drupal Libraries API <https://www.drupal.org/project/libraries>`_
3. `D3 v3 javascript library <https://github.com/d3/d3/releases?after=v4.0.0>`_

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
