<?php
/**
 * @file Construct Basic Test Libraries Load.
 */

namespace Drupal\Tests\tripald3\Functional;

use Drupal\Tests\BrowserTestBase;
use Drupal\Core\Url;

/**
 * Test basic functionality of TripalD3 Libararies Load.
 * 
 * @group tripald3
 */
class LibrariesLoadsTest extends BrowserTestBase {
  /**
   * Dependencies module to load required for this test.
   * Include tripald3 module.
   */
  protected static $modules = [
    'tripal', 
    'libraries', 
    'tripald3'
  ];

  /**
   * A simple user with permission.
   */
  private $user;

  protected $strictConfigSchema = FALSE;
  protected $defaultTheme = 'stable';

  /**
   *  {@inheritdoc}
   */
  protected function setUp(): void {
    parent::setUp();
    
    // Create a registered user with relevant permission.
    $this->user = $this->drupalCreateUser([
      'administer tripal'
    ]);
  }

  /**
   * Test configuration form and libraries.
   */
  public function testConfiguration() {
    // Begin a test session.
    $assert = $this->assertSession();

    // Test that this module does not cause any errors
    // that might be shown in the front page.
    $this->drupalGet('<front>');
    $assert->statusCodeEquals('200');

    // Configuration route.
    $route_config = Url::fromRoute('tripald3.config');

    // # Test when user is anonymous.
    $this->drupalGet($route_config);
    $assert->pageTextContains('Access Denied');

    // # Test when user is registered.
    $this->drupalLogin($this->user);
    $assert->pageTextNotContains('Access Denied');

    // Access demo page - see relevant elements and svg representing
    // TripalD3 chart or diagram demo.     
    $route_demo = Url::fromRoute('tripald3.demo');
    $this->drupalGet($route_demo);
    $assert->statusCodeEquals('200');

    // Assert all chart element container/wrapper have been rendered.
    $containers = [
      'tripald3-multidonut2',
      'tripald3-simplepie',
      'tripald3-simpledonut',
      'tripald3-multidonut',
      'tripald3-barchart',
      'tripald3-pedigree',
      'tripald3-pedigree-right'
    ];
    
    $page = $this->getSession()->getPage();

    // Each container will contain an svg element
    // therefore, there will be the same number of svgs
    // as there are container elements.
    foreach($containers as $ids) {
      $id = '#' . $ids;
      $assert->elementexists('css', $id);
      // See if in the container an svg has been inserted too.
      // svg with class .tripald3-chart.
      $page->find('css', '#tripald3-multidonut2 .tripald3-chart');  
    }
  }
}