// pdp.page.js
// http://webdriver.io/guide/testrunner/pageobjects.html

import Page from './page';

// This class contains Page Object Locators and methods for the Screen.
// It inherits from Page.
class SignInScreen extends Page {

  /**
  * define elements
  */
  
  // '$' is equivalent to 'browser.element'
  // http://webdriver.io/api/utility/$.html
  // http://webdriver.io/guide/usage/selectors.html
  // To search for name: $('name:mySelector') or $('~mySelector')
  // To search for class name: $('class name:mySelector')
  // To search for id: $('id:mySelector')

  
  get textfield_username()  { return $("id:7263030"); }
  get textfield_password()  { return $("id:7263028"); }
  get btn_startsession()  { return $("id:7263026"); }


  /**
   * your page specific methods
   */


}

export default new SignInScreen()
