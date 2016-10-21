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

	(function(window, document, undefined){

	  var StringField = __webpack_require__(1);
	  /**
	   * Utility function to find the value of an attribute in a series of nested
	   * objects using a string path.
	   * Inspired by http://stackoverflow.com/questions/6491463/accessing-nested-javascript-objects-with-string-key
	   */
	  function deepFind(obj, path) {
	    // convert indexes to properties
	    path = path.replace(/\[(\w+)\]/g, '.$1');
	    // strip a leading dot
	    path = path.replace(/^\./, '');
	    // Split the path into an array of keys and indexes
	    var arr = path.split('.');
	    for (var i = 0, n = arr.length; i < n; ++i) {
	        var key = arr[i];
	        if (key in obj) {
	            obj = obj[key];
	        } else {
	            return;
	        }
	    }
	    return obj;
	  }

	  /**
	   * The constructor for the AutomateForm object
	   */
	  var AutomateForm = function(node) {
	    var _self = this;
	    _self.el = node;
	    _self.name = node.getAttribute('automate-form');

	    // TODO: need to throw an error here if the form does not have a name

	    // TODO: This is just an example field, remove in implementation
	    _self.addField({
	      type: 'string',
	      key: 'fooBar',
	      placeholder: 'Optional Foo'
	    });

	    _self.addField({
	      type: 'string',
	      key: 'bar_and_stuff',
	      label: 'Special FooBar',
	    });

	    _self.addField({
	      type: 'string',
	      key: 'no_label',
	      label: false,
	    });
	  }

	  AutomateForm.prototype.addStringField = function(config) {
	    var _self = this;
	    // Create the div to wrap around both elements
	    var wrapper = document.createElement('div');
	    var inputName = _self.name + "." + config.key;

	    // Create the label element
	    if (config.label !== false) {
	      var label = document.createElement('label');
	      label.setAttribute('for', inputName);
	      label.innerText = config.label || config.key;
	      wrapper.appendChild(label);
	    }

	    // Create the input element
	    var input = document.createElement('input');
	    input.setAttribute('type', 'text');
	    input.setAttribute('name', inputName);
	    input.setAttribute('id', inputName);
	    input.setAttribute('placeholder', config.placeholder || '');
	    wrapper.appendChild(input);

	    // Append the input and label elements
	    _self.el.appendChild(wrapper);
	  }

	  AutomateForm.prototype.addField = function(config) {
	    var _self = this;
	    switch (config.type) {
	      case "string":
	        _self.addStringField(config);
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
/* 1 */
/***/ function(module, exports) {

	var StringField = function(config) {
	}

	module.exports = StringField;


/***/ }
/******/ ]);