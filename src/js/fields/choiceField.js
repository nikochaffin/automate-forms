var _s = require('../settings.js');
var MultiInputField = require('./multiInputField.js');

ChoiceField.prototype = Object.create(MultiInputField.prototype);
ChoiceField.prototype.constructor = ChoiceField;

function ChoiceField(config) {
  var _self = this;
  _self._onFieldChange = function(e) {
    _self.value = e.target.value
  }
  MultiInputField.call(_self, config);
  _self.labelEl.classList.add(_s.prefixClass('label--choice'));
  _self.wrapperEl.classList.add(_s.prefixClass('field-wrapper--no-underline'));
  _self.wrapperEl.addEventListener('change', function(e) { _self._onFieldChange.call(_self, e) });
}

module.exports = ChoiceField;
