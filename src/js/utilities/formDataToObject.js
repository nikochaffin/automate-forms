function formDataToObject(data, form) {
  var output = {};
  var keysIterator = data.keys();
  var item = keysIterator.next();

  while (!item.done) {
    var val;
    if (form) {
      var inputs = form.querySelectorAll("input[name=\"" + item.value + "\"]");
      if (inputs.length == 1) {
        var input = inputs[0];
        val = input.automateValue || input.afValue || input.value;
      } else if (inputs.length > 1 && inputs[0].type == "radio") {
        for (var i = 0; i < inputs.length; i++) {
          if (inputs[i].checked) {
            val = inputs[i].value;
            break;
          }
        }
      }
    } else {
      val = data.get(item.value);
    }
    if (typeof val != "object") {
      if (val.match(/^\d+$/) && (!!parseFloat(val) || parseFloat(val) == 0)) {
        val = parseFloat(val);
      }
      output[item.value] = val;
    }
    item = keysIterator.next();
  }

  return output;
}

module.exports = formDataToObject;
