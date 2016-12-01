var _s = require('../settings.js');
var TextInputField = require('./abstracts/textInputField.js');

IntegerField.prototype = Object.create(TextInputField.prototype);
IntegerField.prototype.constructor = IntegerField;

function IntegerField(config) {
  var _self = this;
  _self.valueParse = function(val) {
    if (val !== "") {
      return parseInt(val);
    }
    return "";
  }
  TextInputField.call(_self, config);
  _self.el.classList.add(_s.prefixClass('field--integer'));
  _self.setAllowedCharacters(/\d/);
}
module.exports = IntegerField;
