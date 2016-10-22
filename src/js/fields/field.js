var _s = require('../settings.js');

var Field = function(config) {
  var _self = this;
  var elTag = config.elementTag || 'input';
  _self.name = config.key;
  var inputName = config.inputName || config.key;
  var el = document.createElement(elTag);
  el.setAttribute('name', inputName);
  el.setAttribute('id', inputName);
  el.setAttribute('placeholder', config.placeholder || '');
  el.classList.add(_s.prefixClass('field'));

  el.addEventListener('focus', function(e){ _self._onFieldFocus.call(_self, e) });
  el.addEventListener('blur', function(e){ _self._onFieldBlur.call(_self, e) });
  _self.el = el;
}

Field.prototype._onFieldFocus = function(e) {
  var _self = this;
  if (_self.wrapperEl) {
    _self.wrapperEl.classList.add(_s.prefixClass('field-focused'));
  }
  console.log(_self.name, "focused");
}

Field.prototype._onFieldBlur = function(e) {
  var _self = this;
  if (_self.wrapperEl) {
    _self.wrapperEl.classList.remove(_s.prefixClass('field-focused'));
  }
  console.log(_self.name, "blurred");
}

module.exports = Field;
