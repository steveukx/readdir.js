
(function(exports) {

   "use strict";

   var fs = require('fs');

   /**
    * For the supplied paths list, matches against the supplied filters and returns a new array of paths that
    * are ordered as the list of filters would imply they should be. The filters can include * as a match-anything in
    * one directory or ** for match any file in any directory. All filters are treated as an ends-with match.
    *
    * @param {String[]} paths
    * @param {String[]} filters
    * @return String[]
    */
   function file_list_filter(paths, filters) {
      var result = [];
      filters.forEach(function(filter) {
         var filterRegex = new RegExp('^' +
            filter.replace(/\./g, '\\.')
               .replace(/(\*?)(\*)(?!\*)/g, function(match, prefix) {
                  if(prefix == '*') {
                     return match;
                  }
                  return '[^\\/]*';
               })
               .replace(/\*\*/g, '\.*') + '$'
            , 'i');

         paths.forEach(function(path) {
            if(result.indexOf(path) < 0 && path.match(filterRegex)) {
               result.push(path);
            }
         });

      });
      return result;
   }

   /**
    * Gets a flag that identifies whether the supplied path is a directory or a file, true when a directory. In the
    * case that the file doesn't exist the result will be false.
    *
    * @param path
    * @return {Boolean}
    */
   function is_dir(path) {
      try {
         return fs.statSync(path).isDirectory();
      }
      catch (e) {
         return false;
      }
   }

   /**
    * Reads the supplied directory path and builds an array of files within the directory. This will work recursively
    * on each sub directory found. The optional appendTo argument can be used to merge file paths onto an existing
    * array, and is used internally for recursion.
    *
    * @param {String} dir
    * @param {String[]} appendTo
    * @param {Number} prefixLength
    */
   function read_dir(dir, appendTo, prefixLength) {
      var contents = fs.readdirSync(dir),
         result = appendTo || [];

      contents.forEach(function(itm) {
         var newPath = dir + itm;
         if(is_dir(newPath)) {
            read_dir(newPath + '/', result, prefixLength);
         }
         else {
            if(result.indexOf(newPath) < 0) {
               result.push(newPath.substring(prefixLength));
            }
         }
      });

      return result;
   }

   /**
    * Changes the values in the supplied paths array to be absolute URIs
    *
    * @param {String} prefix
    * @param {String[]} paths
    */
   function prepend_paths(prefix, paths) {
      paths.forEach(function(path, index) {
         paths[index] = prefix + path;
      });
   }

   function sort_paths(paths, sorter) {
      return paths.sort(sorter);
   }

   function caseless_sort(pathA, pathB) {
      var a = ('' + pathA).toLowerCase(),
          b = ('' + pathB).toLowerCase();

      if(a == b) {
         return 0;
      }
      else {
         return a > b ? 1 : -1;
      }
   }

   function case_sort(pathA, pathB) {
      if(pathA == pathB) {
         return 0;
      }
      else {
         return pathA > pathB ? 1 : -1;
      }
   }

   /**
    *
    * @param {String} basePath
    * @param {String[]} [includeFilters]
    * @param {Number} [options]
    */
   exports.readSync = function(basePath, includeFilters, options) {
      var rootDir = basePath.replace(/\/$/, '') + '/',
          allFiles = read_dir(rootDir, [], rootDir.length);

      if(Array.isArray(includeFilters)) {
         allFiles = file_list_filter(allFiles, includeFilters);
      }

      if(exports.ABSOLUTE_PATHS & options) {
         prepend_paths(require('path').resolve(process.cwd(), basePath) + '/', allFiles);
      }

      if(exports.CASELESS_SORT & options) {
         allFiles = sort_paths(allFiles, caseless_sort);
      }

      if(exports.CASE_SORT & options) {
         allFiles = sort_paths(allFiles, case_sort);
      }

      return allFiles;
   };

   exports.isDir = is_dir;

   /**
    * Bitwise option for making the return paths absolute URIs instead of being from the supplied base path
    * @type {Number}
    */
   exports.ABSOLUTE_PATHS = 1;

   /**
    * Bitwise option for making the return array sorted case insensitively
    * @type {Number}
    */
   exports.CASELESS_SORT = 2;

   /**
    * Bitwise option for making the return array sorted case sensitively
    * @type {Number}
    */
   exports.CASE_SORT = 4;

}(typeof module == 'undefined' ? (window.ReadDir = {}) : module.exports));
