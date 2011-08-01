var path = require('path');
var Finder = require('./finder');
var oop = require('oop');
var str = require('./str');
var spawn = require('child_process').spawn;

module.exports = Far;

function Far() {
  oop.mixin(this, Finder);

  this._start = null;

  this._verbose = 0;

  this._index = 0;
  this._errors = 0;
  this._lastStatus = null;

  this._interval = 500;
  this._intervalTimer = null;
};

Far.create = function() {
  var far = new Far();
  return far;
};

Far.createFromArgv = function(argv) {
  var far = this.create();
  far.applyArgv(argv);
  return far;
};

Far.prototype.applyArgv = function(argv) {
  argv = argv.slice(2);

  var arg;
  while (arg = argv.shift()) {
    if (arg === '-e') {
      this.exclude(argv.shift());
      continue;
    }

    if (arg === '-i') {
      this.include(argv.shift());
      continue;
    }

    if (arg.match(/^-v+/)) {
      this.verbose(arg.length - 1);
      continue;
    }

    this.add(arg);
  }
};

Far.prototype.verbose = function(increase) {
  this._verbose += increase || 1;
};

Far.prototype.execute = function() {
  this._start = new Date;
  this.findSync();

  if (this._verbose == 0) {
    this._intervalTimer = setInterval(this._printStatus.bind(this), this._interval);
  }
  this._executeNext();
};

Far.prototype._executeNext = function() {
  var path = this._files[this._index];
  if (!path) {
    this._end();
    return;
  }

  this._execute(path);
};

Far.prototype._execute = function(file) {
  this._printStatus(file);

  var node = spawn(process.execPath, [file]);
  var output = '';

  node.stdout.setEncoding('utf8');
  node.stderr.setEncoding('utf8');

  function onOutput(chunk) {
    if (this._verbose > 1) {
      process.stderr.write(chunk);
    } else {
      output += chunk;
    }
  }

  node.stdout.on('data', onOutput.bind(this));
  node.stderr.on('data', onOutput.bind(this));

  node.on('exit', function(code) {
    this._index++;
    this._printTestResult(file, code, output);
    this._executeNext();
  }.bind(this));
};

Far.prototype._clearStatus = function() {
  if (!this._lastStatus || this._verbose > 0) {
    return;
  }

  var spaces = str.repeat(' ', this._lastStatus.length);
  process.stderr.write('\r' + spaces + '\r');
};

Far.prototype._printStatus = function() {
  var template = '\r[%s %s/%s/%s %s %s]';

  var line = str.sprintf(
    template,
    this._getElapsedTime(),
    this._errors,
    this._getPasses(),
    this.getFileCount(),
    this._getProgress(),
    this._getCurrentFile()
  );

  this._clearStatus();
  process.stderr.write(line);
  this._lastStatus = line;

  if (this._verbose > 0) {
    process.stderr.write('\n');
  }
};

Far.prototype._printTestResult = function(file, code, output) {
  if (code === 0) {
    return;
  }

  this._errors++;

  if (this._verbose <= 1) {
    process.stderr.write('\n' + output);
  }

  process.stderr.write('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n');
  process.stderr.write(path.basename(process.execPath) + ' ' + file + '\n\n');
};

Far.prototype._getProgress = function() {
  return ((this._index + 1) * 100 / this.getFileCount()).toFixed(1) + '%';
};

Far.prototype._getPasses = function() {
  return this._index + 1 - this._errors;
};

Far.prototype._getCurrentFile = function() {
  return this._files[this._index].substr(this.getBasePath().length + 1);
};

Far.prototype._getElapsedTime = function(showMs) {
  var duration = new Date - this._start;
  if (showMs && duration < 1000) {
    return duration + 'ms';
  }

  var seconds = Math.floor((duration) / 1000);
  var minutes = Math.floor(seconds / 60);
  var hours = Math.floor(minutes / 60);

  seconds -= (minutes * 60) - (hours * 60 * 60);
  minutes -= hours * 60;

  if (minutes < 10) {
    minutes = '0' + minutes;
  }

  if (seconds < 10) {
    seconds = '0' + seconds;
  }

  return hours + ':' + minutes + ':' + seconds;
};

Far.prototype._end = function() {
  clearInterval(this._intervalTimer);
  this._clearStatus();

  var finalOutput = str.sprintf(
    '%s errors in %s files (%s)\n',
    this._errors,
    this.getFileCount(),
    this._getElapsedTime(true)
  );

  process.stdout.write(finalOutput);
  process.reallyExit(this._getExitCode());
};

Far.prototype._getExitCode = function() {
  return (this._errors > 0)
    ? 1
    : 0;
};
