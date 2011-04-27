# far

A simple test runner that **f**inds **a**nd **r**uns multiple node.js files,
while providing useful information about output and exit codes.

## Philosophy

far tries to be a good unix citizen. This means all non-essential output is
written to stderr, and only the final result is printed to stdout. Exit codes
of all executed files are interpreted, and it is easy to combine far with other
tools like `find` and `xargs`.

## Command Line Interface

By default, node-far will execute all `*.js` files in the given directories.

``` bash
node-far test/
```

You can also execute multiple individual files:

``` bash
node-far test/test-a.js test/test-b.js
```

Or you can specify regular expressions to be matched against against the list
of all included files.

``` bash
node-far test/ -i "test-.*\.js$"
```
And of course you can also exclude files the same way:

``` bash
node-far test/ -e "common\.js$"
```

### Output Verboseness

The amount of output can be controlled via the `-v` flag. Setting it once, will
list all executed tests on one line, as opposed of re-writing the status to the
current line.

``` bash
node-far -v test/
```

Setting the verbose flag twice, will show the output from all executed files as
they are being executed. Otherwise only the output of commands with an exit code
other than 0 is shown.

``` bash
node-far -vv test/
```

## API Interface

As shown below, configuring your own test suite can also be done programtically.

``` javascript
var far = require('far').create();

// Include an individual file (relative the the current working directory)
far.add('my-file.js');

// Include all files from a given directory
far.add(__dirname);

// Add an include filter to be matched against all added files before execution
far.include(/\/test-.*\.js$/);

// Add an exclude filter, which filters out all matching paths before execution
far.exclude(/system/);

// Execute the test suite
far.execute();
```

## Todo

* TAP output
* Handle Ctrl+C
* Allow setting node flags
* Execute non-node files

## License

far is licensed under the MIT license.
