var _s = require('../settings.js');
var Field = require('./field.js');

TextInputField.prototype = Object.create(Field.prototype);
TextInputField.prototype.constructor = TextInputField;

function TextInputField(config) {
  var _self = this;
  Field.call(_self, config);

  _self.el.addEventListener('keydown', function(e){ _self._onKeyDown.call(_self, e) });
}

TextInputField.prototype._onKeyDown = function(e) {
  var _self = this;
  if (_self._allowedCharacters) {
    if (e.key.length == 1 && (!_self._isValidCharacter(e.key) || !_self._checkLimitedCharacter(e.key))) {
      e.preventDefault();
    }
  }
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
  var charLimit = _self._limitedCharacters[char];
  if (charLimit && (typeof charLimit == "number" || typeof charLimit.limit == "number")) {
    var re = new RegExp(charLimit.re, 'g') || new RegExp(char, 'g');
    var limit = charLimit.limit || charLimit;
    var uses = _self.value.match(re);
    return (!uses || uses.length < charLimit);
  }
  return true;
}

module.exports = TextInputField;
