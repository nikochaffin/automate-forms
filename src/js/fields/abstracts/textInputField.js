var _s = require('../../settings.js');
var Field = require('./field.js');

TextInputField.prototype = Object.create(Field.prototype);
TextInputField.prototype.constructor = TextInputField;

function TextInputField(config) {
  var _self = this;
  Field.call(_self, config);

  _self.el.addEventListener('focus', function(e){ _self._onFieldFocus.call(_self, e) });
  _self.el.addEventListener('blur', function(e){ _self._onFieldBlur.call(_self, e) });
  _self.el.addEventListener('input', function(e){ _self._onFieldInput.call(_self, e) });
  _self.el.addEventListener('keydown', function(e){ _self._onKeyDown.call(_self, e) });
  _self.el.addEventListener('keypress', function(e){ _self._onKeyPress.call(_self, e) });
  _self._onFieldInput();
}

TextInputField.prototype._onKeyDown = function(e) {
  var _self = this;
  // console.log(e);
  console.log(e.target.value);
  if (!e.key) {
    e.target.setAttribute('no-e-key', '');
  }
  var char = e.key || String.fromCharCode(e.which);
  // console.log(e.which, char, String.fromCharCode(e.keyCode), String.fromCharCode(e.charCode), char === "", !!char, char === " ");
  if (!e.key && ((e.which < 46 && e.which != 32) || (e.which > 111 && e.which <= 123))) {
    // console.log("Key should be ignored.");
    return true;
  }
  if (_self._allowedCharacters) {
    if (char.length == 1 && (!_self._isValidCharacter(char) || !_self._checkLimitedCharacter(char))) {
      e.preventDefault();
    }
  }
}

TextInputField.prototype._onKeyPress = function(e) {
  console.log(e.target.value);
}

TextInputField.prototype.setAllowedCharacters = function(valid) {
  var _self = this;
  _self._allowedCharacters = new RegExp(valid, 'g');
}

TextInputField.prototype.setLimitedCharacters = function(config) {
  var _self = this;
  _self._limitedCharacters = config;
}

TextInputField.prototype._isValidCharacter = function(char) {
  var _self = this;
  if (_self._allowedCharacters) {
    return !!char.match(_self._allowedCharacters);
  } else {
    return true;
  }
}

TextInputField.prototype._checkLimitedCharacter = function(char) {
  var _self = this;
  if (!_self._limitedCharacters) {
    return true;
  }
  // var charLimit = _self._limitedCharacters[char];
  // console.log(charLimit);
  for (c in _self._limitedCharacters) {
    var charLimit = _self._limitedCharacters[c];
    if (charLimit && (typeof charLimit == "number" || typeof charLimit.limit == "number")) {
      var re = new RegExp(charLimit.re, 'g') || new RegExp(char, 'g');
      if (char.match(re)) {
        var limit = charLimit.limit || charLimit;
        var uses = _self.value.toString().match(re);
        return (!uses || uses.length < charLimit.limit);
      }
    }
  }
  return true;
}

TextInputField.prototype._onFieldInput = function(e) {
  var _self = this;
  if (e) {
    console.log(e.target.hasAttribute('no-e-key'));
  }
  _self.value = _self.valueParse(_self.el.value);
  if (_self.wrapperEl) {
    if (_self.value !== "") {
      _self.wrapperEl.classList.add(_s.prefixClass('field-has-content'));
    } else {
      _self.wrapperEl.classList.remove(_s.prefixClass('field-has-content'));
    }
  }
}

module.exports = TextInputField;
