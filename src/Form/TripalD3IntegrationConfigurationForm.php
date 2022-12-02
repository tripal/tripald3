<?php
/**
 * @file 
 * Construct configuration form to allow configuration
 * of charts and diagram elements.
 */

namespace Drupal\tripald3\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;

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
    $lib = \Drupal::service('library.discovery')->getLibraryByName('tripald3', 'D3');
    if (!$lib) {
      // Library not found.
      \Drupal::messenger()->addError(t('Unable to find D3 library. Please see documentation.'));  
      
      // Nothing to render but the error message.
      return false;
    }
    
    // Attach main library D3 and script variables.
    // NOTE: d3 library is an external library.
    $form['#attached']['library'][] = 'tripald3/D3';
    
    // Javascript library to demo the colour schemes.
    $form['#attached']['library'][] = 'tripald3/create-colour-pallets';
    
    // Create colour pallets using color scheme service.
    $service = \Drupal::service('tripald3.TripalD3ColorScheme');
    $to_Drupalsettings = $service->registerColorScheme();
    $form['#attached']['drupalSettings']['colorscheme_display'] = $to_Drupalsettings;


    // Configurations:
    $config = $this->config(static::SETTINGS);
    $config_scheme = $config->get('tripald3_colorScheme'); 
    $config_resize = $config->get('tripald3_autoResize'); 

    
    // Form render array:
    // Field: Auto-Resize option.
    $form['general'] = [
      '#type' => 'fieldset',
      '#title' => $this->t('General'),
    ];
    
    $form['general']['fld_checkbox_autoresize'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Auto-Resize'),
      '#default_value' => $config_resize,

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
      
    $schemes = $service->loadColorSchemes();
    $options = [];
    foreach ($schemes as $id => $scheme) {
      $options[ $id ] = $scheme['name'] . '<div id="TD3-scheme-' . $id . '" class="' . $id . '"></div>';
    }
    
    $form['colors']['fld_radio_colorscheme'] = [
      '#type' => 'radios',
      '#options' => $options,
      '#default_value' => $config_scheme
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