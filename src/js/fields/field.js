var _s = require('../settings.js');

var Field = function(config) {
  var _self = this;

  // Create the div to wrap around both elements
  var wrapper = document.createElement('div');
  wrapper.classList.add(_s.prefixClass('field-wrapper'));

  var elTag = config.elementTag || 'input';
  _self.name = config.key;
  var inputName = config.inputName || config.key;
  var el = document.createElement(elTag);
  el.setAttribute('name', inputName);
  el.setAttribute('id', inputName);
  if (config.placeholder) {
    el.setAttribute('placeholder', config.placeholder || '');
    wrapper.classList.add(_s.prefixClass('field-has-placeholder'));
  }
  if (config.disabled) {
    el.setAttribute('disabled', '');
  }
  el.classList.add(_s.prefixClass('field'));

  el.addEventListener('focus', function(e){ _self._onFieldFocus.call(_self, e) });
  el.addEventListener('blur', function(e){ _self._onFieldBlur.call(_self, e) });
  el.addEventListener('input', function(e){ _self._onFieldInput.call(_self, e) });

  _self.el = el;

  _self.wrapperEl = wrapper;
  wrapper.appendChild(_self.el);

  // Create the label element
  if (config.label !== false) {
    var label = document.createElement('label');
    label.setAttribute('for', config.inputName || config.key);
    label.innerText = config.label || config.key;
    label.classList.add(_s.prefixClass('label'));
    wrapper.appendChild(label);
  }
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

Field.prototype._onFieldInput = function(e) {
  var _self = this;
  _self.value = _self.el.value;
  if (_self.wrapperEl) {
    if (_self.value !== "") {
      _self.wrapperEl.classList.add(_s.prefixClass('field-has-content'));
    } else {
      _self.wrapperEl.classList.remove(_s.prefixClass('field-has-content'));
    }
  }
  console.log(_self.name, "input");
}

module.exports = Field;
