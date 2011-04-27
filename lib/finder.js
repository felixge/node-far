var paths = require('./paths');

function Finder() {
  this._includePaths = [];
  this._include = [];
  this._exclude = [];
}
module.exports = Finder;

Finder.prototype.add = function(path) {
  this._includePaths.push(path);
};

Finder.prototype.exclude = function(regex) {
  this._exclude.push(regex);
};

Finder.prototype.include = function(regex) {
  this._include.push(regex);
};

Finder.prototype.findSync = function() {
  var files = paths.expandSync(this._includePaths);
  return this._filter(files);
};

Finder.prototype._filter = function(files) {
  if (!this._include.length) {
    this.include(/.js$/);
  }

  return files
    .filter(function(file) {
      var keep = true;

      this._include.forEach(function(include) {
        keep = keep && file.match(include);
      });

      this._exclude.forEach(function(exclude) {
        keep = keep && !file.match(exclude);
      });

      return keep;
    }.bind(this));
};

