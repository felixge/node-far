var common = require('../../common');
var assert = common.assert;
var path = require('path');

var paths = require(common.dir.lib + '/paths');
process.chdir(__dirname);

(function testRelativePath() {
  var relativePath = path.basename(__filename);
  var expanded = paths.expandSync([relativePath]);
  assert.deepEqual(expanded, [__filename]);
})();

(function testAbsolutePath() {
  var expanded = paths.expandSync([__filename]);
  assert.deepEqual(expanded, [__filename]);
})();

(function testDuplicatePaths() {
  var expanded = paths.expandSync([__filename, __filename]);
  assert.deepEqual(expanded, [__filename]);
})();

(function testDirectory() {
  var expanded = paths.expandSync([common.dir.fixture]);
  assert.ok(expanded.length >= 4);
})();
