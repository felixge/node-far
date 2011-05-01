var paths = require('./paths');
var path = require('path');

function Finder() {
  this._includePaths = [];
  this._include = [];
  this._exclude = [];
  this._files = [];
  this._basePath = null;
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
  this._files = this._filter(files);
};

Finder.prototype.getBasePath = function() {
  if (this._basePath) {
    return this._basePath;
  }

  var basePath = '';
  this._files.forEach(function(file) {
    if (!basePath) {
      basePath = path.dirname(file);
    }

    while (file.indexOf(basePath) < 0) {
      basePath = path.dirname(basePath);
    }
  }.bind(this));

  return this._basePath = basePath;
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

Finder.prototype.getFileCount = function() {
  return this._files.length;
};
