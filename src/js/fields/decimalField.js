var _s = require('../settings.js');
var TextInputField = require('./textInputField.js');

DecimalField.prototype = Object.create(TextInputField.prototype);
DecimalField.prototype.constructor = DecimalField;

function DecimalField(config) {
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

module.exports = DecimalField;
