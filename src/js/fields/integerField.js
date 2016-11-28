var _s = require('../settings.js');
var Field = require('./field.js');

var IntegerField = function(config) {
  var _self = this;
  Field.call(_self, config);
  _self.el.classList.add(_s.prefixClass('field--integer'));
  _self.setAllowedCharacters(/\d/);
}

IntegerField.prototype = Object.create(Field.prototype);
IntegerField.prototype.constructor = IntegerField;

module.exports = IntegerField;
