(function(window, document, undefined){

  var _s = require('../utilities/settings.js');
  var StringField = require('./fields/stringField.js');
  var IntegerField = require('./fields/integerField.js');
  var DecimalField = require('./fields/decimalField.js');
  var BooleanField = require('./fields/booleanField.js');
  var ChoiceField = require('./fields/choiceField.js');
  var FileField = require('./fields/fileField.js');
  var ajax = require('../utilities/ajaxCall');
  var newGuid = require('../utilities/newGuid');

  /**
   * The constructor for the AutomateForm object
   */
  function AutomateForm(node) {
    var _self = this;
    _self.el = node;
    _self.name = node.getAttribute('automate-form-name') || node.getAttribute('af-name');
    _self.name = _self.name.split('.');
    _self.instance = _self.name[0];
    _self.name = _self.name[1];
    _self.filesUploaded = false;

    _self._fieldTypes = {
      "string": StringField,
      "integer": IntegerField,
      "decimal": DecimalField,
      "boolean": BooleanField,
      "file": FileField,
      "choice": ChoiceField,
    }

    _self.getFormRequest = ajax({
      url: _self.getUrlBase() + '/api/v1/forms/get_form?form_name=' + _self.name,
    }).success(function(form) {
      // console.log(form);

      if (!!_self.el.querySelector('input[name="_submission_guid"]')) {
        var submitGuid = newGuid();
        var guidInput = document.createElement('input');
        guidInput.setAttribute('type', 'hidden');
        guidInput.setAttribute('name', '_submission_guid');
        guidInput.value = submitGuid;
        _self.el.appendChild(guidInput);
        _self._submissionField = guidInput;
      } else {
        _self._submissionField = _self.el.querySelector('input[name="_submission_guid"]');
      }

      if (form.fields && form.fields.length > 0) {
        for (var i = 0; i < form.fields.length; i++) {
          _self.addField(form.fields[i]);
        }

        _self.submitEl = document.createElement('button');
        _self.submitEl.setAttribute('type', 'submit');
        _self.submitEl.classList.add(_s.prefixClass('button'));
        _self.submitEl.classList.add(_s.prefixClass('submit-button'));
        var text = document.createElement('span');
        text.classList.add(_s.prefixClass('button-text'));
        text.innerText = "Submit";
        _self.submitEl.appendChild(text);
        var spinner = document.createElement('span');
        spinner.classList.add(_s.prefixClass('spinner'));
        _self.submitEl.appendChild(spinner);
        _self.el.appendChild(_self.submitEl);
      }
    });

  }

  AutomateForm.prototype.getUrlBase = function() {
    return "https://" + this.instance + ".nebrios.com";
  }

  AutomateForm.prototype._appendResponse = function(json) {
    var _self = this;
    var pre = document.createElement('pre');
    var code = document.createElement('code');
    code.innerText = JSON.stringify(json, null, 2);
    pre.classList.add(_s.prefixClass('response-preview'))
    pre.appendChild(code);
    _self.el.appendChild(pre);
  }

  AutomateForm.prototype.addField = function(config) {
    var _self = this;
    _self.fields = _self.fields || {};
    _self.fields[config.key] = config;
    if (_self._fieldTypes[config.type]) {
      var field = new _self._fieldTypes[config.type](config);
      _self.el.appendChild(field.wrapperEl);
      _self.fields[config.key]._field = field;
      delete _self.fields[config.key].val;
    } else {
      console.warn("Couldn't create a field for the type \"" + config.type + "\".");
    }
  }

  /**
   * Create the "AutomateForm" object on the window.
   */
  window.AutomateForm = AutomateForm;

  /**
   * When the DOM content has been loaded, gather all elements on the page that
   * match the provided selectors.
   */
  function onDocumentReady() {
    var selectors = ["form[automate-form-name]", "form[af-name]"];
    var formElements = document.querySelectorAll(selectors.join(", "));

    for (var i = 0; i < formElements.length; i++) {
      var form = new AutomateForm(formElements[i]);
    }
  }

  /**
   * If the DOM is done loading, execute "onDocumentReady". Otherwise, wait
   * until the DOM is done loading to execute it.
   */
  if (document.readyState !== 'loading') {
    onDocumentReady();
  } else {
    document.addEventListener('DOMContentLoaded', onDocumentReady);
  }
})(window, window.document);
