var bin = module.exports;

var common = require('../common');
var node = process.argv[0];
var spawn = require('child_process').spawn;

bin.execute = function(/* arg1, ..., cb */) {
  var args = Array.prototype.slice.call(arguments);
  var cb = args.pop();

  args.unshift(common.dir.bin + '/node-far');

  var far = spawn(node, args);

  var stdout = this._buffer(far.stdout);
  var stderr = this._buffer(far.stderr);

  far.on('exit', function(code, signal) {
    cb(code, stdout(), stderr());
  });
};

bin._buffer = function(stream) {
  var data = '';
  stream.setEncoding('utf8');
  stream.on('data', function(chunk) {
    data += chunk;
  });

  return function() {
    return data;
  };
};
