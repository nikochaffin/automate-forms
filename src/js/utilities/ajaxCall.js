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
