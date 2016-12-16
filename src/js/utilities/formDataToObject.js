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
