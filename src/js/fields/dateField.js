var _s = require('../settings.js');
var TextInputField = require('./abstracts/textInputField.js');

DateField.prototype = Object.create(TextInputField.prototype);
DateField.prototype.constructor = DateField;

function DateField(config) {
  var _self = this;
  _self.valueParse = function(val) {
    if (val !== "") {
      return parseFloat(val);
    }
    return "";
  }
  TextInputField.call(_self, config);
  _self.el.classList.add(_s.prefixClass('field--decimal'));
  _self.setAllowedCharacters(/[\d\.]/);
  _self.setLimitedCharacters({
    ".": {
      re: /\./,
      limit: 1
    }
  });
}

module.exports = DateField;
