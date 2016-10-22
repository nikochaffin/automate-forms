var _s = require('../settings.js');
var Field = require('./field.js');

var StringField = function(config) {
  var _self = this;
  Field.call(_self, config);
  _self.el.setAttribute('type', 'text');
  _self.el.classList.add(_s.prefixClass('field--string'));
}

StringField.prototype = Object.create(Field.prototype);
StringField.prototype.constructor = StringField;

module.exports = StringField;
