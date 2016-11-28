var _s = require('../settings.js');
var ControlField = require('./controlField.js');

BooleanField.prototype = Object.create(ControlField.prototype);
BooleanField.prototype.constructor = BooleanField;

function BooleanField(config) {
  var _self = this;
  ControlField.call(_self, config);
  _self.el.setAttribute('type', 'checkbox');
  _self.el.classList.add(_s.prefixClass('field--boolean'));
  _self.labelEl.classList.add(_s.prefixClass('label--boolean'));
  _self.wrapperEl.classList.add(_s.prefixClass('field-wrapper--no-underline'));
}

module.exports = BooleanField;
