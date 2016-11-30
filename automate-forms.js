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

	// require('./lib/classListPolyfill');
	__webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	(function(window, document, undefined){

	  var _s = __webpack_require__(2);
	  var StringField = __webpack_require__(3);
	  var IntegerField = __webpack_require__(6);
	  var DecimalField = __webpack_require__(7);
	  var BooleanField = __webpack_require__(8);
	  var ChoiceField = __webpack_require__(10);
	  var FileField = __webpack_require__(13);
	  var ajax = __webpack_require__(14);
	  var newGuid = __webpack_require__(15);

	  /**
	   * The constructor for the AutomateForm object
	   */
	  function AutomateForm(node) {
	    var _self = this;
	    _self.el = node;
	    _self.name = node.getAttribute('automate-form').split('.');
	    _self.instance = _self.name[0];
	    _self.name = _self.name[1];

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

	    _self.el.addEventListener('submit', function(e) {
	      e.preventDefault();
	      _self.submitEl.setAttribute('disabled', '');
	      // var formData = new FormData();
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
	        // console.log(data);
	        _self.submitEl.removeAttribute('disabled');

	        var pre = document.createElement('pre');
	        var code = document.createElement('code');
	        code.innerText = JSON.stringify(data, null, 2);
	        pre.classList.add(_s.prefixClass('response-preview'))
	        pre.appendChild(code);
	        _self.el.appendChild(pre);

	        _self._submissionField.value = newGuid();
	      })
	    });

	    // TODO: need to throw an error here if the form does not have a name
	  }

	  AutomateForm.prototype.getUrlBase = function() {
	    return "https://" + this.instance + ".nebrios.com";
	  }

	  AutomateForm.prototype.getPostUrl = function() {
	    return this.getUrlBase() + "/api/v1/forms/post_form";
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


/***/ },
/* 2 */
/***/ function(module, exports) {

	var settings = {};

	settings.cssClassPrefix = "af-";
	settings.prefixClass = function(className) {
	  return settings.cssClassPrefix + className;
	}

	module.exports = settings;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var _s = __webpack_require__(2);
	var TextInputField = __webpack_require__(4);

	StringField.prototype = Object.create(TextInputField.prototype);
	StringField.prototype.constructor = StringField;

	function StringField(config) {
	  var _self = this;
	  TextInputField.call(_self, config);
	  _self.el.setAttribute('type', 'text');
	  _self.el.classList.add(_s.prefixClass('field--string'));
	}

	module.exports = StringField;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var _s = __webpack_require__(2);
	var Field = __webpack_require__(5);

	TextInputField.prototype = Object.create(Field.prototype);
	TextInputField.prototype.constructor = TextInputField;

	function TextInputField(config) {
	  var _self = this;
	  Field.call(_self, config);

	  _self.el.addEventListener('focus', function(e){ _self._onFieldFocus.call(_self, e) });
	  _self.el.addEventListener('blur', function(e){ _self._onFieldBlur.call(_self, e) });
	  _self.el.addEventListener('input', function(e){ _self._onFieldInput.call(_self, e) });
	  _self.el.addEventListener('keydown', function(e){ _self._onKeyDown.call(_self, e) });
	  _self._onFieldInput();
	}

	TextInputField.prototype._onKeyDown = function(e) {
	  var _self = this;
	  if (_self._allowedCharacters) {
	    if (e.key.length == 1 && (!_self._isValidCharacter(e.key) || !_self._checkLimitedCharacter(e.key))) {
	      e.preventDefault();
	    }
	  }
	}

	TextInputField.prototype.setAllowedCharacters = function(valid) {
	  var _self = this;
	  _self._allowedCharacters = new RegExp(valid, 'g');
	}

	TextInputField.prototype.setLimitedCharacters = function(config) {
	  var _self = this;
	  _self._limitedCharacters = config;
	}

	TextInputField.prototype._isValidCharacter = function(char) {
	  var _self = this;
	  if (_self._allowedCharacters) {
	    return !!char.match(_self._allowedCharacters);
	  } else {
	    return true;
	  }
	}

	TextInputField.prototype._checkLimitedCharacter = function(char) {
	  var _self = this;
	  if (!_self._limitedCharacters) {
	    return true;
	  }
	  var charLimit = _self._limitedCharacters[char];
	  if (charLimit && (typeof charLimit == "number" || typeof charLimit.limit == "number")) {
	    var re = new RegExp(charLimit.re, 'g') || new RegExp(char, 'g');
	    var limit = charLimit.limit || charLimit;
	    var uses = _self.value.toString().match(re);
	    return (!uses || uses.length < charLimit);
	  }
	  return true;
	}

	TextInputField.prototype._onFieldInput = function(e) {
	  var _self = this;
	  _self.value = _self.valueParse(_self.el.value);
	  if (_self.wrapperEl) {
	    if (_self.value !== "") {
	      _self.wrapperEl.classList.add(_s.prefixClass('field-has-content'));
	    } else {
	      _self.wrapperEl.classList.remove(_s.prefixClass('field-has-content'));
	    }
	  }
	}

	module.exports = TextInputField;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var _s = __webpack_require__(2);

	function Field(config) {
	  var _self = this;

	  // Create the div to wrap around both elements
	  var wrapper = document.createElement('div');
	  wrapper.classList.add(_s.prefixClass('field-wrapper'));

	  var elTag = config.elementTag || 'input';
	  _self.name = config.key;
	  var inputName = config.inputName || config.key;
	  var el = document.createElement(elTag);
	  el.setAttribute('name', inputName);
	  el.setAttribute('id', config.key);
	  if (config.placeholder) {
	    el.setAttribute('placeholder', config.placeholder || '');
	    wrapper.classList.add(_s.prefixClass('field-has-placeholder'));
	  }
	  if (config.disabled) {
	    el.setAttribute('disabled', '');
	  }
	  if (config.val) {
	    el.setAttribute('value', config.val);
	    wrapper.classList.add(_s.prefixClass('field-has-content'));
	  }
	  el.classList.add(_s.prefixClass('field'));

	  _self.el = el;

	  _self.wrapperEl = wrapper;
	  wrapper.appendChild(_self.el);

	  // Create the label element
	  if (config.label !== false) {
	    var label = document.createElement('label');
	    label.setAttribute('for', config.key);
	    label.innerText = config.label || config.key;
	    label.classList.add(_s.prefixClass('label'));
	    wrapper.appendChild(label);
	    _self.labelEl = label;
	  }
	}

	Field.prototype._onFieldFocus = function(e) {
	  var _self = this;
	  if (_self.wrapperEl) {
	    _self.wrapperEl.classList.add(_s.prefixClass('field-focused'));
	  }
	}

	Field.prototype._onFieldBlur = function(e) {
	  var _self = this;
	  if (_self.wrapperEl) {
	    _self.wrapperEl.classList.remove(_s.prefixClass('field-focused'));
	  }
	}

	Field.prototype.valueParse = function(val) {
	  return val;
	}

	module.exports = Field;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var _s = __webpack_require__(2);
	var TextInputField = __webpack_require__(4);

	IntegerField.prototype = Object.create(TextInputField.prototype);
	IntegerField.prototype.constructor = IntegerField;

	function IntegerField(config) {
	  var _self = this;
	  _self.valueParse = function(val) {
	    if (val !== "") {
	      return parseInt(val);
	    }
	    return "";
	  }
	  TextInputField.call(_self, config);
	  _self.el.classList.add(_s.prefixClass('field--integer'));
	  _self.setAllowedCharacters(/\d/);
	}
	module.exports = IntegerField;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var _s = __webpack_require__(2);
	var TextInputField = __webpack_require__(4);

	DecimalField.prototype = Object.create(TextInputField.prototype);
	DecimalField.prototype.constructor = DecimalField;

	function DecimalField(config) {
	  var _self = this;
	  _self.valueParse = function(val) {
	    if (val !== "") {
	      return parseFloat(val);
	    }
	    return "";
	  }
	  TextInputField.call(_self, config);
	  _self.el.classList.add(_s.prefixClass('field--decimal'));
	  _self.setAllowedCharacters(/[\d\.]/);
	  _self.setLimitedCharacters({
	    ".": {
	      re: /\./,
	      limit: 1
	    }
	  });
	}

	module.exports = DecimalField;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var _s = __webpack_require__(2);
	var ControlField = __webpack_require__(9);

	BooleanField.prototype = Object.create(ControlField.prototype);
	BooleanField.prototype.constructor = BooleanField;

	function BooleanField(config) {
	  var _self = this;
	  _self.valueParse = function(val) {
	    var _self = this;
	    return _self.el.checked;
	  }
	  ControlField.call(_self, config);
	  _self.el.setAttribute('type', 'checkbox');
	  _self.el.classList.add(_s.prefixClass('field--boolean'));
	  _self.labelEl.classList.add(_s.prefixClass('label--boolean'));
	  _self.wrapperEl.classList.add(_s.prefixClass('field-wrapper--no-underline'));
	}

	module.exports = BooleanField;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var _s = __webpack_require__(2);
	var Field = __webpack_require__(5);

	ControlField.prototype = Object.create(Field.prototype);
	ControlField.prototype.constructor = ControlField;

	function ControlField(config) {
	  var _self = this;
	  Field.call(_self, config);

	  _self.wrapperEl.classList.remove(_s.prefixClass('field-has-content'));
	  _self.wrapperEl.classList.remove(_s.prefixClass('field-has-placeholder'));
	  _self.el.addEventListener('change', function(e) { _self._onFieldChange.call(_self, e) });
	  if (_self._onFieldChange) {
	    _self._onFieldChange();
	  }
	}

	ControlField.prototype._onFieldChange = function(e) {
	  var _self = this;
	  _self.value = _self.valueParse(_self.el.value);
	}

	module.exports = ControlField;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var _s = __webpack_require__(2);
	var MultiInputField = __webpack_require__(11);

	ChoiceField.prototype = Object.create(MultiInputField.prototype);
	ChoiceField.prototype.constructor = ChoiceField;

	function ChoiceField(config) {
	  var _self = this;
	  _self.value = "";
	  _self._onFieldChange = function(e) {
	    _self.value = e.target.value
	  }
	  MultiInputField.call(_self, config);
	  _self.labelEl.classList.add(_s.prefixClass('label--choice'));
	  _self.wrapperEl.classList.add(_s.prefixClass('field-wrapper--no-underline'));
	  _self.wrapperEl.addEventListener('change', function(e) { _self._onFieldChange.call(_self, e) });
	}

	module.exports = ChoiceField;


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var _s = __webpack_require__(2);
	var RadioField = __webpack_require__(12);

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


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var _s = __webpack_require__(2);
	var ControlField = __webpack_require__(9);

	RadioField.prototype = Object.create(ControlField.prototype);
	RadioField.prototype.constructor = RadioField;

	function RadioField(config) {
	  var _self = this;
	  ControlField.call(_self, config);
	  _self.el.setAttribute('type', 'radio');
	  _self.el.classList.add(_s.prefixClass('field--radio'));
	  _self.labelEl.classList.add(_s.prefixClass('label--radio'));
	  _self.wrapperEl.classList.add(_s.prefixClass('field-wrapper--no-underline'));
	}

	module.exports = RadioField;


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var _s = __webpack_require__(2);
	var ControlField = __webpack_require__(9);

	FileField.prototype = Object.create(ControlField.prototype);
	FileField.prototype.constructor = FileField;

	function FileField(config) {
	  var _self = this;

	  _self._onFieldChange = function(e) {
	    console.log(_self.el.files);
	    _self._clearFileList();
	    if (_self.el.files) {
	      for (var i = 0; i < _self.el.files.length; i++) {
	        _self._addFileToList(_self.el.files[i], i);
	      }
	    }
	  }

	  _self._labelText = config.label || config.key;
	  _self.multiple = config.multiple || false;

	  ControlField.call(_self, config);
	  _self.el.setAttribute('type', 'file');
	  _self.el.classList.add(_s.prefixClass('field--file'));
	  _self.labelEl.classList.add(_s.prefixClass('label--file'));
	  _self.labelEl.innerText = "Click to upload";
	  _self.wrapperEl.classList.add(_s.prefixClass('field-wrapper--no-underline'));

	  var extraLabel = document.createElement("label");
	  extraLabel.classList.add(_s.prefixClass("label--plain"));
	  extraLabel.innerText = _self._labelText;
	  extraLabel.setAttribute('for', config.inputName || config.key);
	  _self.wrapperEl.insertBefore(extraLabel, _self.el);

	  var clearButton = document.createElement("button");
	  clearButton.setAttribute('type', 'button');
	  clearButton.classList.add(_s.prefixClass("button"));
	  clearButton.classList.add(_s.prefixClass("button--file-clear"));
	  clearButton.innerText = "\u00d7";
	  clearButton.addEventListener('click', function(e) { _self._resetFiles.call(_self, e) });
	  _self.wrapperEl.appendChild(clearButton);

	  var fileList = document.createElement("ul");
	  fileList.classList.add(_s.prefixClass("file-list"));
	  _self.wrapperEl.appendChild(fileList);
	  _self.fileListEl = fileList;
	}

	FileField.prototype._addFileToList = function(file, i) {
	  var _self = this;
	  var li = document.createElement("li");
	  li.innerText = file.name;
	  li.setAttribute('data-i', i);
	  // var closeButton = document.createElement("button");
	  // closeButton.setAttribute('type', 'button');
	  // closeButton.innerText = "\u00d7";
	  // closeButton.addEventListener('click', function(e) { _self._onRemoveButtonClick.call(_self, e) });
	  // li.appendChild(closeButton);
	  _self.fileListEl.appendChild(li);
	}

	FileField.prototype._clearFileList = function() {
	  var _self = this;
	  if (_self.fileListEl) {
	    while (_self.fileListEl.firstChild) {
	      _self.fileListEl.removeChild(_self.fileListEl.firstChild);
	    }
	  }
	}

	FileField.prototype._resetFiles = function() {
	  var _self = this;
	  _self.el.value = "";
	  _self._clearFileList();
	}

	FileField.prototype._onRemoveButtonClick = function(e) {
	  var _self = this;
	  var i = e.target.parentNode.getAttribute('data-i');
	  i = parseInt(i);
	  console.log(_self.el.files.splice(i, 0));
	}

	module.exports = FileField;


/***/ },
/* 14 */
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
/* 15 */
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


/***/ }
/******/ ]);