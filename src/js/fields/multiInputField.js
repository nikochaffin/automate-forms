var _s = require('../settings.js');
var RadioField = require('./radioField.js');

function MultiInputField(config) {
  var _self = this;

  // Create the div to wrap around both elements
  var wrapper = document.createElement('div');
  wrapper.classList.add(_s.prefixClass('field-wrapper'));
  _self.wrapperEl = wrapper;

  // Create the label element
  if (config.label !== false) {
    var label = document.createElement('label');
    label.setAttribute('for', config.inputName || config.key);
    label.innerText = config.label || config.key;
    label.classList.add(_s.prefixClass('label'));
    wrapper.appendChild(label);
    _self.labelEl = label;
  }

  _self._choiceFields = [];

  for (var i = 0; i < config.choices.length; i++) {
    var choiceConfig = {
      inputName: config.inputName || config.key,
      key: (config.inputName || config.key) + "[" + i + "]",
      val: config.choices[i][0],
      label: config.choices[i][1]
    }
    var choiceField = new RadioField(choiceConfig);
    _self.wrapperEl.appendChild(choiceField.wrapperEl);
    _self._choiceFields.push(choiceField);
  }

  if (config.val) {
    for (var i = 0; i < _self._choiceFields.length; i++) {
      if (_self._choiceFields[i].el.value == config.val) {
        _self._choiceFields[i].el.checked = true;
      }
    }
  }
}

module.exports = MultiInputField;
