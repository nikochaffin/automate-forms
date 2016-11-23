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

module.exports = deepFind;
