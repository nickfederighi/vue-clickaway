import Vue from 'vue';

export var version = '1.1.5';

var compatible = (/^1\./).test(Vue.version);
if (!compatible) {
  Vue.util.warn('VueClickaway ' + version + ' only supports Vue 1.x, and does not support Vue ' + Vue.version);
}

export var directive = {

  acceptStatement: true,
  priority: 700,

  update: function(handler) {
    if (typeof handler !== 'function') {
      if (process.env.NODE_ENV !== 'production') {
        Vue.util.warn(
          this.name + '="' +
          this.expression + '" expects a function value, ' +
          'got ' + handler
        );
      }
      return;
    }

    this.reset();

    var el = this.el;
    var scope = this._scope || this.vm;

    this.handler = function(ev) {
      // @NOTE: IE 5.0+
      // @REFERENCE: https://developer.mozilla.org/en/docs/Web/API/Node/contains
      if (!el.contains(ev.target)) {
        scope.$event = ev;
        var res = handler(ev);
        scope.$event = null;
        return res;
      }
    };

    Vue.util.on(document.documentElement, 'click', this.handler);
  },

  reset: function() {
    Vue.util.off(document.documentElement, 'click', this.handler);
  },

  unbind: function() {
    this.reset();
  },

};

export var mixin = {
  directives: { onClickaway: directive },
};
