(function(window, document, undefined){

  var _s = require('./settings.js');
  var StringField = require('./fields/stringField.js');
  var IntegerField = require('./fields/integerField.js');
  var DecimalField = require('./fields/decimalField.js');
  var BooleanField = require('./fields/booleanField.js');
  var ChoiceField = require('./fields/choiceField.js');
  var FileField = require('./fields/fileField.js');
  var ajax = require('./utilities/ajaxCall');
  var newGuid = require('./utilities/newGuid');

  /**
   * The constructor for the AutomateForm object
   */
  function AutomateForm(node) {
    var _self = this;
    _self.el = node;
    _self.name = node.getAttribute('automate-form').split('.');
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

      var submitGuid = newGuid();
      var guidInput = document.createElement('input');
      guidInput.setAttribute('type', 'hidden');
      guidInput.setAttribute('name', '_submission_guid');
      guidInput.value = submitGuid;
      _self.el.appendChild(guidInput);
      _self._submissionField = guidInput;

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

    _self.el.addEventListener('submit', function(e) { _self._onSubmit.call(_self, e); });
  }

  AutomateForm.prototype._onSubmit = function(e) {
    if (e) {
      e.preventDefault();
    }
    var _self = this;
    _self.submitEl.setAttribute('disabled', '');

    var _fileFields = {};
    var _filesCount = 0;
    for (field in _self.fields) {
      if (_self.fields[field].type == "file" && _self.fields[field]._field.el.files.length > 0) {
        _fileFields[_self.fields[field].key] = _self.fields[field];
        _filesCount++;
      }
    }

    console.log(_filesCount);

    if (_filesCount > 0 && !_self.filesUploaded) {
      console.log("there are files to submit!");
      var formData = new FormData();
      formData.set('_submission_guid', _self._submissionField.value);
      for (field in _fileFields) {
        var _field = _fileFields[field]._field.el;
        for (var i = 0; i < _field.files.length; i++) {
          console.log(_field.files[i]);
          formData.append(field, _field.files[i], _field.files[i].name);
        }
      }
      _self.submitFileRequest = ajax({
        method: "POST",
        url: _self.getFileUrl(),
        data: formData
      }).success(function(data) {
        _self._appendResponse(data);
        _self.filesUploaded = true;
        _self._onSubmit();
      });
    } else {
      console.log("There are no files to submit");
      var formData = {};
      formData._submission_guid = _self._submissionField.value;
      for (fieldName in _self.fields) {
        var field = _self.fields[fieldName];
        formData[fieldName] = field._field.value;
      }
      _self.sumbitFormRequest = ajax({
        method: "POST",
        url: _self.getPostUrl(),
        data: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json"
        }
      }).success(function(data) {
        _self.submitEl.removeAttribute('disabled');
        _self._appendResponse(data);
        _self.filesUploaded = false;
        _self._submissionField.value = newGuid();
      });
    }
  }

  AutomateForm.prototype.getUrlBase = function() {
    return "https://" + this.instance + ".nebrios.com";
  }

  AutomateForm.prototype.getPostUrl = function() {
    return this.getUrlBase() + "/api/v1/forms/post_form";
  }

  AutomateForm.prototype.getFileUrl = function() {
    return this.getUrlBase() + "/api/v1/forms/file_upload";
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
   * Create the "AutomateForm" object if it already doesn't exist.
   */
  window.AutomateForm = AutomateForm;

  /**
   * When the DOM content has been loaded, gather all elements on the page that
   * match the provided selectors.
   */
  function onDocumentReady() {
    var selectors = ["form[automate-form]"];
    var formElements = [];
    for (var i = 0; i < selectors.length; i++) {
      var forms = document.querySelectorAll(selectors[i]);
      if (forms) {
        formElements = formElements.concat(Array.prototype.slice.call(forms));
      }
    }

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
