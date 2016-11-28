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
	  var ajax = __webpack_require__(10);

	  /**
	   * The constructor for the AutomateForm object
	   */
	  function AutomateForm(node) {
	    var _self = this;
	    _self.el = node;
	    _self.name = node.getAttribute('automate-form').split('.');
	    _self.instance = _self.name[0];
	    _self.name = _self.name[1];

	    _self.getFormRequest = ajax({
	      url: _self.getUrlBase() + '/api/v1/forms/get_form?form_name=' + _self.name,
	    }).success(function(form) {
	      // console.log(form);
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
	      var formData = new FormData(_self.el);
	      _self.sumbitFormRequest = ajax({
	        method: "POST",
	        url: _self.getPostUrl(),
	        data: formData,
	      }).success(function(data) {
	        console.log(data);
	        _self.submitEl.removeAttribute('disabled');
	      })
	    });

	    // TODO: need to throw an error here if the form does not have a name

	    // TODO: This is just an example field, remove in implementation
	    // _self.addField({
	    //   type: 'string',
	    //   key: 'fooBar',
	    //   placeholder: 'Optional Foo'
	    // });
	    //
	    // _self.addField({
	    //   type: 'string',
	    //   key: 'bar_and_stuff',
	    //   label: 'Special FooBar',
	    // });
	    //
	    // _self.addField({
	    //   type: 'string',
	    //   key: 'no_label',
	    //   label: false,
	    // });
	    //
	    // _self.addField({
	    //   type: 'string',
	    //   key: 'disabled_input',
	    //   label: false,
	    //   disabled: true,
	    //   placeholder: 'Disabled'
	    // });

	    // var submitButton = document.createElement('button');
	    // submitButton.setAttribute('type', 'submit');
	    // submitButton.innerText = "Submit";
	    // _self.el.appendChild(submitButton);
	  }

	  AutomateForm.prototype.getUrlBase = function() {
	    return "https://" + this.instance + ".nebrios.com";
	  }

	  AutomateForm.prototype.getPostUrl = function() {
	    return this.getUrlBase() + "/api/v1/forms/post_form";
	  }

	  AutomateForm.prototype.addStringField = function(config) {
	    var _self = this;

	    // Create the input element
	    var input = new StringField(config);

	    // Append the input and label elements
	    _self.el.appendChild(input.wrapperEl);
	  }

	  AutomateForm.prototype.addIntegerField = function(config) {
	    var _self = this;

	    // Create the input element
	    var input = new IntegerField(config);

	    // Append the input and label elements
	    _self.el.appendChild(input.wrapperEl);
	  }

	  AutomateForm.prototype.addDecimalField = function(config) {
	    var _self = this;

	    // Create the input element
	    var input = new DecimalField(config);

	    // Append the input and label elements
	    _self.el.appendChild(input.wrapperEl);
	  }

	  AutomateForm.prototype.addBooleanField = function(config) {
	    var _self = this;

	    // Create the input element
	    var input = new BooleanField(config);

	    // Append the input and label elements
	    _self.el.appendChild(input.wrapperEl);
	  }

	  AutomateForm.prototype.addField = function(config) {
	    var _self = this;
	    switch (config.type) {
	      case "string":
	        _self.addStringField(config);
	        break;
	      case "integer":
	        _self.addIntegerField(config);
	        break;
	      case "decimal":
	        _self.addDecimalField(config);
	        break;
	      case "boolean":
	        _self.addBooleanField(config);
	        break;
	      default:
	        console.warn("Uknown field type");
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

	  _self.el.addEventListener('keydown', function(e){ _self._onKeyDown.call(_self, e) });
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
	    var uses = _self.value.match(re);
	    return (!uses || uses.length < charLimit);
	  }
	  return true;
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
	  el.setAttribute('id', inputName);
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

	  el.addEventListener('focus', function(e){ _self._onFieldFocus.call(_self, e) });
	  el.addEventListener('blur', function(e){ _self._onFieldBlur.call(_self, e) });
	  el.addEventListener('input', function(e){ _self._onFieldInput.call(_self, e) });

	  _self.el = el;

	  _self.wrapperEl = wrapper;
	  wrapper.appendChild(_self.el);

	  // Create the label element
	  if (config.label !== false) {
	    var label = document.createElement('label');
	    label.setAttribute('for', config.inputName || config.key);
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

	Field.prototype._onFieldInput = function(e) {
	  var _self = this;
	  _self.value = _self.el.value;
	  if (_self.wrapperEl) {
	    if (_self.value !== "") {
	      _self.wrapperEl.classList.add(_s.prefixClass('field-has-content'));
	    } else {
	      _self.wrapperEl.classList.remove(_s.prefixClass('field-has-content'));
	    }
	  }
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
	}

	module.exports = ControlField;


/***/ },
/* 10 */
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


/***/ }
/******/ ]);