(function(window) {
  //I recommend this
  'use strict';

  function define() {
    var poppify = {};
    var pm = {
      animationEnd : function(elem, fn) {
        var animationendArr = ['webkitAnimationEnd', 'oanimationend', 'msAnimationEnd', 'animationend'];
        for (var i = 0; i < animationendArr.length; ++i) {
          elem.addEventListener(animationendArr[i], fn, false);
        }
      },
      transitionEnd : function(elem, fn) {
        var transitionendAtt = ['transitionend', 'webkitTransitionEnd', 'oTransitionEnd', 'MSTransitionEnd'];
        for (var i = 0; i < transitionendAtt.length; ++i) {
          elem.addEventListener(transitionendAtt[i], fn, false);
        }
      },
      close : function(p, o) {
        if (p.querySelectorAll(':not(.close)').length > 1) {
          o.classList.add('close');
          pm.animationEnd(o, function() {
            o.remove();
          });
        } else {
          p.classList.add('close');
          pm.transitionEnd(p, function() {
            p.remove();
          });
        }
      }
    }
    var options = {
      direction: 'top',
      timing: 4000,
      dismissable: true,
      custom_class: ''
    };
    poppify.init = function(param) {
      options = {
        direction: 'top',
        timing: 4000,
        dismissable: true,
        custom_class: ''
      };
      if (param.direction) {
        options.direction = param.direction;
      }
      if (param.timing) {
        options.timing = param.timing;
      }
      if (param.dismissable) {
        options.timing = param.timing;
      }
      if (param.custom_class) {
        options.custom_class = param.custom_class;
      }

      return options;
    };
    poppify.add = function(param) {
      var text = param.text;
      this.init(param);

      var parent = document.querySelector('.notification.float-' + options.direction);
      if (!parent) {
        var notifClass = 'notification' + (options.custom_class.length ? '-'+options.custom_class : '');
        parent = document.createElement('div');
        parent.className = notifClass + ' float-' + options.direction;
        document.body.appendChild(parent);
      }

      var poppify = document.createElement('span');
      poppify.appendChild(document.createTextNode(text));
      parent.appendChild(poppify);
      if (options.dismissable === true) {
        poppify.onclick = function() {
          p.close(parent, poppify);
        };
      }
      if (options.timing > 0) {
        setTimeout(function() {
          pm.close(parent, poppify)
        }, options.timing);
      }
    };
    return poppify;
  }

  //define globally if it doesn't already exist
  if (typeof(poppify) === 'undefined') {
    window.poppify = define();
  } else {
    console.log("Poppify is already defined.");
  }
})(window);