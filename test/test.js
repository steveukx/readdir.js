
var Assert = require('assert');

(function() {
   var readSync = require('../lib/readdir.js').readSync;

   var everyFile = readSync('example_dir');
   Assert.deepEqual(everyFile, [ 'AAA/aaa.js',
      'AAA/aaa.txt',
      'abc.js',
      'abc.txt',
      'BBB/bbb.js',
      'BBB/bbb.txt',
      'CCC/ccc.js',
      'CCC/ccc.txt',
      'CCC/DDD/ddd.js',
      'CCC/DDD/ddd.txt' ], 'Not supplying a filter selects every file');
}());

(function() {
   var readSync = require('../lib/readdir.js').readSync;

   var everyFile = readSync('example_dir', ['**/**.js']);
   Assert.deepEqual(everyFile, ['AAA/aaa.js',
      'BBB/bbb.js',
      'CCC/ccc.js',
      'CCC/DDD/ddd.js' ], 'double star slash requires sub-directory, js suffix requires file type');
}());

(function() {
   var readSync = require('../lib/readdir.js').readSync;

   var everyFile = readSync('example_dir', ['**.js']);
   Assert.deepEqual(everyFile, [ 'AAA/aaa.js',
      'abc.js',
      'BBB/bbb.js',
      'CCC/ccc.js',
      'CCC/DDD/ddd.js' ], 'double star can have any number of sub-directories and a suffix requires file type');
}());

(function() {
   var readSync = require('../lib/readdir.js').readSync;

   var everyFile = readSync('example_dir', ['BBB/*']);
   Assert.deepEqual(everyFile, ['BBB/bbb.js',
      'BBB/bbb.txt' ], 'path prefix requires that directory, trailing star allows any file type');
}());

(function() {
   var readSync = require('../lib/readdir.js').readSync;

   var everyFile = readSync('example_dir', ['CCC/*']);
   Assert.deepEqual(everyFile, ['CCC/ccc.js',
      'CCC/ccc.txt'], 'Path prefix requires that directory, trailing single star ignores subsequent sub-directories');
}());

(function() {
   var readSync = require('../lib/readdir.js').readSync;

   var everyFile = readSync('example_dir', ['CCC/**']);
   Assert.deepEqual(everyFile, ['CCC/ccc.js',
      'CCC/ccc.txt',
      'CCC/DDD/ddd.js',
      'CCC/DDD/ddd.txt'], 'Double star will include sub-directories');
}());

(function() {
   var readSync = require('../lib/readdir.js').readSync;

   var everyFile = readSync('example_dir', ['*.txt']);
   Assert.deepEqual(everyFile, ['abc.txt'], 'Single star ignores sub-directories and filename is a suffix');
}());