// ===========================================
// vendor
// ===========================================
import './vendor/fontawesome-5.0.8';
window.FontAwesomeConfig = {
  searchPseudoElements: true
};

// ===========================================
// common
// ===========================================
import Common from './modules/common';

let common = new Common();
common.setUp();
