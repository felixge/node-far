var common = module.exports;

var path = require('path');
var root = path.join(__dirname, '..');

common.dir = {
  bin: root + '/bin',
  lib: root + '/lib',
  helper: root + '/test/helper',
  fixture: root + '/test/fixture',
};

common.assert = require('assert');
