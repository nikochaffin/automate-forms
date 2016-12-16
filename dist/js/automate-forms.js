/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(2);


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	(function(window, document, undefined){

	  var ajax = __webpack_require__(3);
	  var getOrCreateSubmissionGuid = __webpack_require__(4);
	  var formDataToObject = __webpack_require__(6);
	  var newGuid = __webpack_require__(5);

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


/***/ },
/* 3 */
/***/ function(module, exports) {

	function ajaxCall(config) {
	  var _self = this;
	  _self.method = config.method || "GET";
	  _self.url = config.url;
	  if (!_self.url) {
	    console.warn("URL not specified");
	  }

	  _self._xhr = new XMLHttpRequest();
	  _self._xhr.onload = function(e) {
	    var data = e.target.responseText;
	    try {
	      data = JSON.parse(data);
	    }
	    catch(e) {
	    }
	    finally {
	      if (_self._successCallback) {
	        _self._successCallback.call({}, data);
	      }
	    }
	  }

	  _self._xhr.open(_self.method, _self.url);
	  if (config.headers) {
	    for (header in config.headers) {
	      _self._xhr.setRequestHeader(header, config.headers[header]);
	    }
	  }
	  if (config.data) {
	    _self._xhr.send(config.data);
	  } else {
	    _self._xhr.send();
	  }

	  _self.success = function(cb) {
	    _self._successCallback = cb;
	  }

	  return _self;
	}

	module.exports = ajaxCall;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var newGuid = __webpack_require__(5);

	function getOrCreateSubmissionGuid(node) {
	  var submissionField;
	  if (!node.querySelector('input[name="_submission_guid"]')) {
	    var submitGuid = newGuid();
	    var guidInput = document.createElement('input');
	    guidInput.setAttribute('type', 'hidden');
	    guidInput.setAttribute('name', '_submission_guid');
	    guidInput.value = submitGuid;
	    node.appendChild(guidInput);
	    submissionField = guidInput;
	  } else {
	    submissionField = node.querySelector('input[name="_submission_guid"]');
	  }
	  return submissionField;
	}

	module.exports = getOrCreateSubmissionGuid;


/***/ },
/* 5 */
/***/ function(module, exports) {

	/**
	 * Generate new guid
	 *
	 * ripped off from http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
	 */
	function newGuid() {
	    var d = new Date().getTime();
	    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
	        var r = (d + Math.random() * 16) % 16 | 0;
	        d = Math.floor(d / 16);
	        return (c == 'x' ? r : r & 3 | 8).toString(16);
	    });
	    return uuid;
	}

	module.exports = newGuid;


/***/ },
/* 6 */
/***/ function(module, exports) {

	function formDataToObject(data) {
	  var output = {};
	  var keysIterator = data.keys();
	  var item = keysIterator.next();

	  while (!item.done) {
	    var val = data.get(item.value);
	    if (typeof val != "object") {
	      if (!!parseFloat(val) || parseFloat(val) == 0) {
	        val = parseFloat(val);
	      }
	      output[item.value] = val;
	    }
	    item = keysIterator.next();
	  }

	  return output;
	}

	module.exports = formDataToObject;


/***/ }
/******/ ]);