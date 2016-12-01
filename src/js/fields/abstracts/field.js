var _s = require('../../settings.js');

function Field(config) {
  var _self = this;

  // Create the div to wrap around both elements
  var wrapper = document.createElement('div');
  wrapper.classList.add(_s.prefixClass('field-wrapper'));

  var elTag = config.elementTag || 'input';
  _self.name = config.key;
  var inputName = config.inputName || config.key;
  var el = document.createElement(elTag);
  el.setAttribute('name', inputName);
  el.setAttribute('id', config.key);
  if (config.placeholder) {
    el.setAttribute('placeholder', config.placeholder || '');
    wrapper.classList.add(_s.prefixClass('field-has-placeholder'));
  }
  if (config.disabled) {
    el.setAttribute('disabled', '');
  }
  if (config.val) {
    el.setAttribute('value', config.val);
    wrapper.classList.add(_s.prefixClass('field-has-content'));
  }
  el.classList.add(_s.prefixClass('field'));

  _self.el = el;

  _self.wrapperEl = wrapper;
  wrapper.appendChild(_self.el);

  // Create the label element
  if (config.label !== false) {
    var label = document.createElement('label');
    label.setAttribute('for', config.key);
    label.innerText = config.label || config.key;
    label.classList.add(_s.prefixClass('label'));
    wrapper.appendChild(label);
    _self.labelEl = label;
  }
}

Field.prototype._onFieldFocus = function(e) {
  var _self = this;
  if (_self.wrapperEl) {
    _self.wrapperEl.classList.add(_s.prefixClass('field-focused'));
  }
}

Field.prototype._onFieldBlur = function(e) {
  var _self = this;
  if (_self.wrapperEl) {
    _self.wrapperEl.classList.remove(_s.prefixClass('field-focused'));
  }
}

Field.prototype.valueParse = function(val) {
  return val;
}

module.exports = Field;
