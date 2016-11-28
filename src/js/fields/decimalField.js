var _s = require('../settings.js');
var Field = require('./field.js');

var DecimalField = function(config) {
  var _self = this;
  Field.call(_self, config);
  _self.el.classList.add(_s.prefixClass('field--decimal'));
  _self.setAllowedCharacters(/[\d\.]/);
  _self.setLimitedCharacters({
    ".": {
      re: /\./,
      limit: 1
    }
  });
}

DecimalField.prototype = Object.create(Field.prototype);
DecimalField.prototype.constructor = DecimalField;

module.exports = DecimalField;
