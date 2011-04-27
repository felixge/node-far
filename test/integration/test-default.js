var common = require('../common');
var assert = common.assert;
var bin = require(common.dir.helper + '/bin');

bin.execute(common.dir.fixture, function(code, stdout, stderr) {
  assert.strictEqual(code, 1);
  assert.ok(stdout.match(/2 errors in 4 files/));
});
