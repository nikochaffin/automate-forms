var settings = {};

settings.cssClassPrefix = "af-";
settings.prefixClass = function(className) {
  return settings.cssClassPrefix + className;
}

module.exports = settings;
