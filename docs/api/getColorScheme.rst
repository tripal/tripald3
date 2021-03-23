
getColorScheme
================

This function retrieves the HEX codes for a given colour scheme. It is used throughout this API to ensure consistent colours across diagrams.

def ``getColorScheme(type, schemeName)``

  Retrieve the colours for a given colour scheme.

  :type: The type of scheme to return false; one of quantitative or categorical (REQUIRED).
  :schemeName: The machine name of the color scheme to return the colors of; Defaults to the scheme chosen by the administrator.

  :returns: An array of HEX codes in the order they should be applied to elements.
