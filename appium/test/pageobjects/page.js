// http://webdriver.io/guide/testrunner/pageobjects.html

export default class Page {

  // Save a screenshot to jestHelpers directory.
  saveScreenshot(dir, filename) {
    let fs = require('fs');
    // Create directory if it doesn't exist.
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    browser.saveScreenshot(dir + filename);
  }
  
  waitForClick(element) {
    browser.waitUntil(function () {
      return element.getAttribute('ishittable') === true
    }, 5000, 'expected element to be hittable after 5s');
    element.click();
  }

}
