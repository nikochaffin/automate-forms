var _s = require('../settings.js');
var TextInputField = require('./abstracts/textInputField.js');

DateField.prototype = Object.create(TextInputField.prototype);
DateField.prototype.constructor = DateField;

function DateField(config) {
  var _self = this;
  _self.valueParse = function(val) {
    var d = new Date(val);
    console.log(d);
    return val;
  }
  TextInputField.call(_self, config);
  _self.el.classList.add(_s.prefixClass('field--date'));
  _self.setAllowedCharacters(/[\d-/ ]/);
  _self.setLimitedCharacters({
    "separator": {
      re: /[-/ ]/,
      limit: 2
    }
  });

  // Allowed pattern: /^\d{0,2}(?!\d)[-/ ]?\d{0,2}?[-/ ]?\d{0,4}?$/
}

module.exports = DateField;
