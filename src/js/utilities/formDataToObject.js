function formDataToObject(data, form) {
  var output = {};
  var keysIterator = data.keys();
  var item = keysIterator.next();

  while (!item.done) {
    var val;
    if (form) {
      var input = form.querySelector("input[name=\"" + item.value + "\"]");
      val = input.automateValue || input.afValue || input.value;
    } else {
      val = data.get(item.value);
    }
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
