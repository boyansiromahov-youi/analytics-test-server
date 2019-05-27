// https://www.chaijs.com/
import { expect } from 'chai';  // Using Expect style.

import WelcomeScreen from '../pageobjects/welcome.page'
import SignInScreen from '../pageobjects/signin.page'
import HomeScreen from '../pageobjects/home.page'

// http://webdriver.io/api/protocol/timeoutsImplicitWait.html
browser.timeoutsImplicitWait(30000);

// This group represents the tests for the screen.
describe('Login Tests', () => {

  context('when in Welcome', () => {
    it('can navigate to home screen', () => {

      WelcomeScreen.waitForClick(WelcomeScreen.btn_start);
      SignInScreen.waitForClick(SignInScreen.textfield_username);
      SignInScreen.textfield_username.setValue('luke.sanderson@youi.tv');
      SignInScreen.waitForClick(SignInScreen.textfield_password);
      SignInScreen.textfield_password.setValue('Youi@1234');

      SignInScreen.waitForClick(SignInScreen.btn_startsession);
      HomeScreen.waitForClick(HomeScreen.btn_close);
      browser.debug();
    });
  });
})
