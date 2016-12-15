var _s = require('../../utilities/settings.js');
var TextInputField = require('../base-fields/textInputField.js');

StringField.prototype = Object.create(TextInputField.prototype);
StringField.prototype.constructor = StringField;

function StringField(config) {
  var _self = this;
  TextInputField.call(_self, config);
  _self.el.setAttribute('type', 'text');
  _self.el.classList.add(_s.prefixClass('field--string'));
}

module.exports = StringField;
