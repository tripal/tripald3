<?php
namespace Drupal\tripald3\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;

// Include colour scheme api of this module.
// @see /api
module_load_include('inc', 'tripald3', 'api/color_scheme');

/**
 * Defines TripalD3IntegrationConfigurationForm class.
 */
class TripalD3IntegrationConfigurationForm extends ConfigFormBase {
  const SETTINGS = 'tripald3.settings';
  
  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'tripald3_admin_settings';
  }

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return [
      static::SETTINGS,
    ];
  }

  /**
   * {@inheritdoc}
   * Build form.
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    // Check if d3 library exists.
    $lib = \Drupal::service('library.discovery')->getLibraryByName('tripald3', 'libd3');
    if (!$lib) {
      drupal_set_message('Unable to load D3.js. Please make sure you have downloaded D3.js and placed it in your sites/all/assets/vendor/d3 directory.', 'error');      
    }

    $config = $this->config(static::SETTINGS);
    
    // Field: Auto-Resize option.
    $form['general'] = [
      '#type' => 'fieldset',
      '#title' => $this->t('General'),
    ];
    
    $form['general']['fld_checkbox_autoresize'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Auto-Resize'),
      '#default_value' => $config->get('tripald3_autoResize'), 

      '#description' => 'Select this option if your theme is fluid-width and you would 
        like TripalD3 diagrams to resize themeselves when users resize the page. 
        If your theme is fixed-width the option will cause the diagram to be redrawn 
        the same whenever the window size has been changed.'      
    ];

    // Field: Colour Scheme.
    $form['colors'] = [
      '#type' => 'fieldset',
      '#title' => 'Color Schemes',
    ];

    $form['colors']['colors_describe'] = [
      '#type' => 'markup',      
      '#markup' => '<p>Select the color scheme below that goes best with the theme of your site. 
        The color scheme chosen will be used for all Tripal D3 Diagrams site-wide providing a nice 
        consistent interface.</p>',
    ];
    
    // Attach main library: D3.
    // NOTE: d3 library is an external library.
    $form['#attached']['library'][] = 'tripald3/libd3';
    $default_scheme = $config->get('tripald3_colorScheme');
    $to_Drupalsettings = tripald3_register_colorschemes($default_scheme);
    $form['#attached']['drupalSettings']['tripald3']['colorscheme_display']['variable'] = $to_Drupalsettings;
    
    // Javascript libraries to demo the colour schemes.
    $form['#attached']['library'][] = 'tripald3/colorscheme_display';
    
    $schemes = tripald3_get_color_schemes();
    $options = [];
    foreach ($schemes as $id => $scheme) {
      $options[ $id ] = $scheme['name'] . '<div id="TD3-scheme-' . $id . '" class="' . $id . '"></div>';
    }
    
    $form['colors']['fld_radio_colorscheme'] = [
      '#type' => 'radios',
      '#options' => $options,
      '#default_value' => $default_scheme
    ];

    return parent::buildForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   * Save configuration.
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $this->configFactory->getEditable(static::SETTINGS)
      ->set('tripald3_autoResize', $form_state->getValue('fld_checkbox_autoresize'))
      ->set('tripald3_colorScheme', $form_state->getValue('fld_radio_colorscheme'))
      ->save();

    return parent::submitForm($form, $form_state);
  }
}