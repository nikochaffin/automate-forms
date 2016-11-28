(function(window, document, undefined){

  var _s = require('./settings.js');
  var StringField = require('./fields/stringField.js');
  var IntegerField = require('./fields/integerField.js');
  var DecimalField = require('./fields/decimalField.js');
  var ajax = require('./utilities/ajaxCall');

  /**
   * The constructor for the AutomateForm object
   */
  var AutomateForm = function(node) {
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
