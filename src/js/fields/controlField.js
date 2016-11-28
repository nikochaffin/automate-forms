var _s = require('../settings.js');
var Field = require('./field.js');

ControlField.prototype = Object.create(Field.prototype);
ControlField.prototype.constructor = ControlField;

function ControlField(config) {
  var _self = this;
  Field.call(_self, config);
}

module.exports = ControlField;
