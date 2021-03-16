<?php
namespace Drupal\tripald3\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Render\Markup;

// Include chado database api relating to pedigree.
// @see /api
module_load_include('inc', 'tripald3', 'api/pedigree');

/**
 * Defines TripalD3PedigreeConfigurationForm class.
 */
class TripalD3PedigreeConfigurationForm extends ConfigFormBase {
  const SETTINGS = 'tripald3.settings';
  
  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'tripald3_pedigree_settings';
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
    $config = $this->config(static::SETTINGS);

    // Attach libraries.
    $form['#attached']['library'][] = 'tripald3/libd3';
    $form['#attached']['library'][] = 'tripald3/pedigree';

    $form['#attached']['library'][] = 'style_pedigree/style-pedigree';

    // Get relationships.
    $rel_options = tripald3_get_stockrelationship();
    $form_state->set('relationships', $rel_options);
    
    $default_rels = $config->get('tripald3_stock_pedigree_rels');
    if (!$default_rels) {
      $default_rels = array(
        'object' => array(),
        'subject' => $rel_options
      );
    }
    else {
      $default_rels = unserialize($default_rels);
    }

    $form['rels'] = [
      '#type' => 'fieldset',
      '#title' => 'Relationships',
    ];

    $form['rels']['info'] = [
      '#type' => 'markup',
      '#markup' => "<div style=\"display: block\">To ensure that pedigrees display correctly, you need to
        configure this module to use your vocabulary correctly. Specifically,
        <ol>
          <li>Ensure that you've choosen all the relationships needed to get from
            your child stock/germplasm to it's parents.</li>
          <li>Ensure that relationships will be followed in the right direction.
            Since relationships are bi-directional in Tripal/Chado you need to
            configure which relationships have the parent as the subject and
            which have the parent as the object.</li>
        </ol>
        <em><strong>NOTE:</strong> Each relationship can only be followed in ONE
          direction.</em></div>"
    ];

    // NOTE: Fieldset title does not coincide with field name. 
    // Fieldset contains the tree diagram where the subject is the parent and thus the current stock is the object. 
    // The form elements are named after the current stock as that's where the data is being added to but it's 
    // more intuitive to researchers if we talk about parents.

    //// Object fields.
    // Diagram, sentence, field select and description.
    // Object Fieldset. 
    $form['rels']['object'] = [
      '#type' => 'fieldset',
      '#title' => 'Subject is Parent',
      // Keep styling rules.
      '#prefix' => Markup::create('<div style="float: left; width: 45%; margin-right: 2%;">'),
      '#suffix' => '</div>',
    ];

    $form['rels']['object']['diagram_object'] = [
      '#type' => 'markup',
      '#allowed_tags' => ['span'],
      '#markup' => '<span class="rel-settings-diagram tree subject"></span>
                    <span class="rel-settings-diagram sentence subject"></span>'
    ];
    
    $description = 'Select the relationships below where the parent-side of the relationship is the subject. 
    This will put the subject higher in the tree than the object, as shown in the digram above.';
    
    $form['rels']['object']['fld_select_object_rels'] = [
      '#type' => 'select',
      '#title' => 'Relationships to include',
      '#options' => $rel_options,
      '#multiple' => TRUE,
      '#default_value' => array_keys($default_rels['object']),

      '#theme_wrappers' => [],
      '#prefix' => '<div><p>' . $description . '</p>',
      '#suffix' => '</div>',      
    ];

    //// Subject fields.
    // Diagram, sentence, field select and description.
    // Subject Fieldset. 
    $form['rels']['subject'] = [
      '#type' => 'fieldset',
      '#title' => 'Object is Parent',
      // Keep styling rules.
      '#prefix' => Markup::create('<div style="float: left; width: 45%; margin-right: 2%;">'),
      '#suffix' => '</div>',
    ];

    $form['rels']['subject']['diagram_subject'] = [
      '#type' => 'markup',
      '#allowed_tags' => ['span'],
      '#markup' => '<span class="rel-settings-diagram tree object"></span>
                    <span class="rel-settings-diagram sentence object"></span>'
    ];
    
    $description = 'Select the relationships below where the parent-side of the relationship is the object. 
    This will put the object higher in the tree than the subject, as shown in the digram above.';
    
    $form['rels']['subject']['fld_select_subject_rels'] = [
      '#type' => 'select',
      '#title' => 'Relationships to include',
      '#options' => $rel_options,
      '#multiple' => TRUE,
      '#default_value' => array_keys($default_rels['subject']),

      '#theme_wrappers' => [],
      '#prefix' => '<div><p>' . $description . '</p>',
      '#suffix' => '</div>',      
    ];

    return parent::buildForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   * Validate relationship configuration.
   */
  public function validateForm(array &$form, FormStateInterface $form_state) {
    // Check that no relationship exists in both subject & object lists.
    // Trying to avoid users configuring endless loops :)
    $fld_subject = 'fld_select_subject_rels';
    $fld_object  = 'fld_select_object_rels';
    $rels_array  = $form_state->get('relationships');

    $val_subject = $form_state->getValue($fld_subject);
    $val_object  = $form_state->getValue($fld_object);
    $common = array_intersect($val_subject, $val_object);
    
    if (!empty($common)) {
      // Make a more useful error message
      $common_rels = array();
      foreach ($common as $id) {
        $common_rels[] = $rels_array[$id];
      }

      // Provide error message.
      $error_subject = 'Each relationship can only be followed in ONE direction (ie: be selected in one of the "Relationships to include" lists)';
      $error_object  = 'Relationships selected in both lists include: <em>' . implode(', ', $common_rels) . '</em>.';
      $form_state->setErrorByName($fld_subject, $this->t($error_subject));
      $form_state->setErrorByName($fld_object, $this->t($error_object));
    } 
  }

  /**
   * {@inheritdoc}
   * Save configuration.
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $fld_subject = 'fld_select_subject_rels';
    $fld_object  = 'fld_select_object_rels';
    $fld_rels    = 'relationships';

    $val_subject = $form_state->getValue($fld_subject);
    $val_object  = $form_state->getValue($fld_object);
    $val_rels    = $form_state->get($fld_rels);
    
    $object_rels = array_intersect_key($val_rels, $val_object);
    $subject_rels = array_intersect_key($val_rels, $val_subject);

    $rels = array(
      'object' => $object_rels,
      'subject' => $subject_rels
    );
    
    $this->configFactory->getEditable(static::SETTINGS)
      ->set('tripald3_stock_pedigree_rels', serialize($rels))
      ->save();

    return parent::submitForm($form, $form_state);
  }
}