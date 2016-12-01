var _s = require('../../settings.js');
var Field = require('./field.js');

ControlField.prototype = Object.create(Field.prototype);
ControlField.prototype.constructor = ControlField;

function ControlField(config) {
  var _self = this;
  Field.call(_self, config);

  _self.wrapperEl.classList.remove(_s.prefixClass('field-has-content'));
  _self.wrapperEl.classList.remove(_s.prefixClass('field-has-placeholder'));
  _self.el.addEventListener('change', function(e) { _self._onFieldChange.call(_self, e) });
  if (_self._onFieldChange) {
    _self._onFieldChange();
  }
}

ControlField.prototype._onFieldChange = function(e) {
  var _self = this;
  _self.value = _self.valueParse(_self.el.value);
}

module.exports = ControlField;
