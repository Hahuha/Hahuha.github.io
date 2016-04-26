(function(window) {
  'use strict';

  function define() {
    var ctrl_c = {};
    ctrl_c.featureEnabled = function () {
      return document.queryCommandSupported('copy') && document.queryCommandEnabled('copy');
    }
    ctrl_c.copy = function (elem) {
      if (this.featureEnabled && elem && elem.select) {
        // select text
        elem.select();
        console.log(elem);
        try {
          // copy text
          document.execCommand('copy');
          elem.blur();
        }
        catch (err) {
          return false;
        }
        return true;
      }
      return false;
    }

    return ctrl_c;
  }

  //define globally if it doesn't already exist
  if (typeof(ctrl_c) === 'undefined') {
    window.ctrl_c = define();
  } else {
    console.log("ctrl_c is already defined.");
  }
})(window);