(function(window, document, undefined){

  var ajax = require('../utilities/ajaxCall');
  var getOrCreateSubmissionGuid = require('../utilities/getOrCreateSubmissionGuid');
  var formDataToObject = require('../utilities/formDataToObject');
  var newGuid = require('../utilities/newGuid');

  var _getUrlBase = function(instance) {
    return "https://" + instance + ".nebrios.com";
  }

  var _getInstance = function(form) {
    var instance = form.getAttribute('automate-forms-action') || form.getAttribute('af-action');
    instance = instance.split('.');
    return {
      instance: instance[0],
      script: instance[1] || "forms",
      endpoint: instance[2] || "post_form"
    }
  }

  var _getPostUrl = function(form) {
    var instance = _getInstance(form);
    return _getUrlBase(instance.instance) + "/api/v1/" + [instance.script, instance.endpoint].join('/');
  }

  var _getFileUrl = function(form) {
    var instance = _getInstance(form);
    return _getUrlBase(instance.instance) + "/api/v1/" + [instance.script, "file_upload"].join('/');
  }

  var _onSubmit = function(e) {
    if (e) {
      e.preventDefault();
    }
    var _self = this;
    _self.submitEl = _self.querySelector('input[type="submit"], button[type="submit"]');
    _self.submitEl.setAttribute('disabled', '');

    _self._submissionField = getOrCreateSubmissionGuid(_self);

    var _fileFields = _self.querySelectorAll('input[type="file"]');
    var _filesCount = 0;
    for (var i=0; i<_fileFields.length; i++) {
      var field = _fileFields[i];
      if (field.type == "file" && field.files.length > 0) {
        _filesCount += field.files.length;
      }
    }

    // console.log(_filesCount);

    if (_filesCount > 0 && !_self.hasAttribute('af-files-uploaded')) {
      console.log("there are files to submit!");
      var formData = new FormData();
      formData.set('_submission_guid', _self._submissionField.value);

      for (var i=0; i<_fileFields.length; i++) {
        var field = _fileFields[i];
        if (field.type == "file" && field.files.length > 0) {
          for (var j = 0; j < field.files.length; j++) {
            console.log(field.files[j]);
            formData.append(field.name, field.files[j], field.files[j].name);
          }
        }
      }

      _self.submitFileRequest = ajax({
        method: "POST",
        url: _getFileUrl(_self),
        data: formData
      }).success(function(data) {
        console.log(data);
        _self.setAttribute('af-files-uploaded', '');
        _onSubmit.call(_self);
      });
    } else {
      // console.log("There are no files to submit");
      var formData = new FormData(_self);
      formData = formDataToObject(formData);
      _self.sumbitFormRequest = ajax({
        method: "POST",
        url: _getPostUrl(_self),
        data: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json"
        }
      }).success(function(data) {
        console.log(data);
        _self.submitEl.removeAttribute('disabled');
        _self.removeAttribute('af-files-uploaded');
        _self._submissionField.value = newGuid();
      });
    }
  }

  function onDocumentReady() {
    var selectors = ["form[automate-form-action]", "form[af-action]"];
    var formElements = document.querySelectorAll(selectors.join(", "));

    for (var i = 0; i < formElements.length; i++) {
      var form = formElements[i];
      form.addEventListener('submit', _onSubmit);
    }
  }
  if (document.readyState !== 'loading') {
    onDocumentReady();
  } else {
    document.addEventListener('DOMContentLoaded', onDocumentReady);
  }

})(window, window.document);
