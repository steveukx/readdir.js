readdir
=======

A Node.js utility module to read the contents of a directory with support for Ant style filtering to easily order the results - particularly useful for any order specific build system.


Node.js
=======

Install using npm `npm install readdir` then use with require for either synchronous use:

```typescript
import { readSync, ABSOLUTE_PATHS, CASELESS_SORT } from 'readdir';

const allTextFilesFilter = ['*.js'];
const options = ABSOLUTE_PATHS + CASELESS_SORT;
const contents = readSync('some_path', allTextFilesFilter, options);

contents.forEach(path => console.log(`Matched path: "${path}"`));
```

or asynchronous use in either promise chains, async/await or with a trailing callback:

```typescript
import { read, ABSOLUTE_PATHS, CASELESS_SORT } from 'readdir';

const allTextFilesFilter = ['*.js'];
const options = ABSOLUTE_PATHS + CASELESS_SORT;
const logMatched = (contents) => contents.forEach(path => console.log(`Matched path: "${path}"`));

// as a step in a promise chain
read('some_path', allTextFilesFilter, options).then(logMatched);

// as an async/await
logMatched(await read('some-path', allTextFilesFilter));

// as a callback
read('some_path', allTextFilesFilter, options, (err, contents) => {
  logMatched(contents);
})
```

Usage
=====

The `readSync( path, [filters, [options]])` method can accept a path that is either
absolute or relative to the current working directory.

Filters can be supplied as an array of strings that are Ant style expressions that
any file found in the `path` directory must satisfy, use a `*` to signify any file
in the current directory or `**` to signify any file in the current or any sub directory.
If the filter contains a `/` then the file path must also include a path, so `*/*` would
mean any file of a directory that is a direct sub-directory of the path directory and
`*/**` would be any file that is in any subdirectory of the path directory.

To select just one type of file, add a file extension suffix to the filter
(eg: `**.js` to pick any JavaScript file in the path directory).

If the options argument is supplied, it should be a number representing the sum of any 
options you want to apply:

`ABSOLUTE_PATHS` changes the return value so that each item in the array is an absolute
path instead of relative to the path directory.

`CASELESS_SORT` sort the return array as a case-insensitive sort

`CASE_SORT` sort the return array as a case-sensitive sort

`INCLUDE_DIRECTORIES` include the names of directories in the results returned, including
just directories can be done by using the filter `['*/']`, note that directory names will
have a trailing slash to identify them from files that have no extension

`INCLUDE_HIDDEN` includes the content of directories named with a leading `.` (which is commonly
used as a way to hide the directory). Note that files named with a leading `.` are included
when they match a file filter and are not impacted by this option: for example `.gitignore`
would be listed files in `.git/*` would not unless `INCLUDE_HIDDEN` is set.

`NON_RECURSIVE` prevents the automatic recursion to only scan the current directory.

Options can also be supplied as an array of the options bits themselves:

```typescript

import { readSync, ReadDirOptions } from 'readdir';

const allTextFilesFilter = ['*.js'];
const options = [ReadDirOptions.ABSOLUTE_PATHS, ReadDirOptions.CASELESS_SORT];
const contents = readSync('some_path', allTextFilesFilter, options);

```

Examples
========

With filters:

```javascript
const readDir = require('readdir');

// an array of all JavaScript files in some_path/
readDir.readSync( 'some_path/', ['**.js'] );
```

With ordering of results using filters:

```javascript
const {readSync, read} = require('readdir');

// an array of all JavaScript files in some_path/ with base.js first, then all core then anything else
const filesArray = readSync( 'some_path/', ['base.js', 'core/**.js', '**.js'] );

// an array of all JavaScript files in some_path/ with base.js first, then all core then anything else
read( 'some_path/', ['base.js', 'core/**.js', '**.js'], function (err, filesArray) {
   // err either null or an error instance
   // filesArray the same as the return value from readSync
});
```

With options

```javascript
const {readSync, read, ABSOLUTE_PATHS, CASELESS_SORT, ReadDirOptions} = require('readdir');

// an array of all files in some_path/ as absolute file paths
readSync( 'some_path/', null, ABSOLUTE_PATHS );

// an array of all files in some_path/ as absolute file paths sorted without case
read( 'some_path/', ABSOLUTE_PATHS + CASELESS_SORT, function (err, allFiles) {});

// an array of just directory names directly under some_path
read( 'some_path/', ['*/'], ReadDirOptions.INCLUDE_DIRECTORIES + ReadDirOptions.NON_RECURSIVE,
  function (err, allFiles) {});
```

Release History
===============

Full details available in the [change log](CHANGELOG.md).

Contributing
============

Pull requests and issue reports are welcomed via https://github.com/steveukx/readdir.js




