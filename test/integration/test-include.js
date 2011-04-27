var common = require('../common');
var assert = common.assert;
var bin = require(common.dir.helper + '/bin');

bin.execute(common.dir.fixture, '-i', 'pass',  function(code, stdout, stderr) {
  assert.strictEqual(code, 0);
  assert.ok(stdout.match(/0 errors in 2 files/));
});
