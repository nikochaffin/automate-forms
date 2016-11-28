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
  if (config.val) {
    el.setAttribute('value', config.val);
    wrapper.classList.add(_s.prefixClass('field-has-content'));
  }
  el.classList.add(_s.prefixClass('field'));

  el.addEventListener('focus', function(e){ _self._onFieldFocus.call(_self, e) });
  el.addEventListener('blur', function(e){ _self._onFieldBlur.call(_self, e) });
  el.addEventListener('input', function(e){ _self._onFieldInput.call(_self, e) });
  el.addEventListener('keydown', function(e){ _self._onKeyDown.call(_self, e) });

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

Field.prototype.setValidCharacters = function(valid) {
  var _self = this;
  _self._validCharacters = new RegExp(valid, 'g');
}

Field.prototype._onFieldFocus = function(e) {
  var _self = this;
  if (_self.wrapperEl) {
    _self.wrapperEl.classList.add(_s.prefixClass('field-focused'));
  }
  // console.log(_self.name, "focused");
}

Field.prototype._onFieldBlur = function(e) {
  var _self = this;
  if (_self.wrapperEl) {
    _self.wrapperEl.classList.remove(_s.prefixClass('field-focused'));
  }
  // console.log(_self.name, "blurred");
}

Field.prototype._isValidCharacter = function(char) {
  var _self = this;
  if (_self._validCharacters) {
    return !!char.match(_self._validCharacters);
  } else {
    return true;
  }
}

Field.prototype._removeInvalidCharacters = function(str) {
  var _self = this;
  if (_self._validCharacters) {
    return str.match(_self._validCharacters).join("");
  }
  return str;
}

Field.prototype._onKeyDown = function(e) {
  var _self = this;
  console.log(e.key, e.keyCode);
  if (_self._validCharacters) {
    if (e.key.length == 1 && !_self._isValidCharacter(e.key)) {
      e.preventDefault();
    }
  }
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
  // console.log(_self.name, "input");
}

module.exports = Field;
