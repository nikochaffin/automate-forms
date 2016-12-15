var _s = require('../../utilities/settings.js');
var ControlField = require('../base-fields/controlField.js');

FileField.prototype = Object.create(ControlField.prototype);
FileField.prototype.constructor = FileField;

function FileField(config) {
  var _self = this;

  _self._onFieldChange = function(e) {
    // console.log(_self.el.files);
    _self._clearFileList();
    if (_self.multiple) {
      if (_self.el.files) {
        for (var i = 0; i < _self.el.files.length; i++) {
          _self._addFileToList(_self.el.files[i], i);
        }
        _self.wrapperEl.classList.add(_s.prefixClass('has-files--multiple'));
      }
    } else {
      if (_self.el.files) {
        _self.labelEl.innerText = _self.el.files[0].name;
        _self.wrapperEl.classList.add(_s.prefixClass('has-files'));
      }
    }

  }

  _self._labelText = config.label || config.key;
  _self.multiple = config.multiple || false;

  ControlField.call(_self, config);
  _self.el.setAttribute('type', 'file');
  if (_self.multiple) {
    _self.el.setAttribute('multiple', '');
  }
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
  if (_self.multiple) {
    if (_self.fileListEl) {
      while (_self.fileListEl.firstChild) {
        _self.fileListEl.removeChild(_self.fileListEl.firstChild);
      }
    }
  } else {
    _self.labelEl.innerText = "Click to upload";
  }
  _self.wrapperEl.classList.remove(_s.prefixClass('has-files'));
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
