function formDataToObject(data, form) {
  var output = {};
  var keysIterator = data.keys();
  // Step to the first key in the iterator
  var item = keysIterator.next();

  // While there are still items to iterate through
  while (!item.done) {
    var val;
    // If the form element was passed in (it should have been)
    if (form) {
      // Get all the inputs within this form with this name
      var inputs = form.querySelectorAll("input[name=\"" + item.value + "\"]");
      if (inputs.length == 1) {
        // If there's only one input, just grab the value
        var input = inputs[0];
        val = input.automateValue || input.afValue || input.value;
      } else if (inputs.length > 1 && inputs[0].type == "radio") {
        // If there is more than one input and the first is a radio button,
        // assume they're all radio buttons and grab the value of the first one
        // that is checked
        for (var i = 0; i < inputs.length; i++) {
          if (inputs[i].checked) {
            val = inputs[i].value;
            break;
          }
        }
      }
    } else {
      // Otherwise, just use the value in the iterator
      val = data.get(item.value);
    }
    if (typeof val != "object") {
      // If the value is not an object (a file)
      if (val.match(/^\d+$/) && (!!parseFloat(val) || parseFloat(val) == 0)) {
        // If the string is made up of only digits, try to parse it as a float
        val = parseFloat(val);
      }
      // Assign the value to the proper key
      output[item.value] = val;
    }
    // Step forward
    item = keysIterator.next();
  }

  return output;
}

module.exports = formDataToObject;
