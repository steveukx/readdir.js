
var Assert = require('assert');

(function() {
   var readSync = require('../lib/readdir.js').readSync;

   var everyFile = readSync('example_dir');
   Assert.deepEqual(everyFile, [ 'example_dir/AAA/aaa.js',
      'example_dir/AAA/aaa.txt',
      'example_dir/abc.js',
      'example_dir/abc.txt',
      'example_dir/BBB/bbb.js',
      'example_dir/BBB/bbb.txt',
      'example_dir/CCC/ccc.js',
      'example_dir/CCC/ccc.txt',
      'example_dir/CCC/DDD/ddd.js',
      'example_dir/CCC/DDD/ddd.txt' ]);
}());

//(function() {
//   var readSync = require('../lib/readdir.js').readSync;
//
//   var everyFile = readSync('example_dir', '**/**.js');
//   Assert.deepEqual(everyFile, [ 'example_dir/AAA/aaa.js',
//      'example_dir/abc.js',
//      'example_dir/BBB/bbb.js',
//      'example_dir/CCC/ccc.js',
//      'example_dir/CCC/DDD/ddd.js' ]);
//}());