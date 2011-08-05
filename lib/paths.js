var paths = module.exports;
var path = require('path');
var fs = require('fs');

paths.expandSync = function(pathList) {
  var expanded = {};

  pathList.forEach(function(path) {
    var isRelativePath = (path.substr(0, 1) !== '/');
    if (isRelativePath) {
      path = process.cwd() + '/' + path;
    }

    if (!paths.isDirectory(path)) {
      expanded[path] = true;
      return;
    }

    paths
      .findRecursiveSync(path)
      .forEach(function(path) {
        expanded[path] = true;
      });
  });

  return Object.keys(expanded);
};

paths.isDirectory = function(path) {
    try {
      var stat = fs.statSync(path);
      return stat.isDirectory();
    } catch (e) {
    }

    return false;
};

paths.findRecursiveSync = function findRecursiveSync(dir) {
  if (!fs.statSync(dir).isDirectory()) {
    return [dir];
  }

  return fs
    .readdirSync(dir)
    .reduce(function (files, file) {
      var p = path.join(dir, file);
      try {
        var stat = fs.statSync(p);
      } catch (e) {
        stat = {isDirectory: function() { return false; }};
      }

      if (stat.isDirectory()) {
        files.push.apply(files, findRecursiveSync(p));
      } else {
        files.push(p);
      }

      return files;
    }, []);
};
