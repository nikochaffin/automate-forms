var _s = require('../../utilities/settings.js');
var ControlField = require('../base-fields/controlField.js');

RadioField.prototype = Object.create(ControlField.prototype);
RadioField.prototype.constructor = RadioField;

function RadioField(config) {
  var _self = this;
  ControlField.call(_self, config);
  _self.el.setAttribute('type', 'radio');
  _self.el.classList.add(_s.prefixClass('field--radio'));
  _self.labelEl.classList.add(_s.prefixClass('label--radio'));
  _self.wrapperEl.classList.add(_s.prefixClass('field-wrapper--no-underline'));
}

module.exports = RadioField;
