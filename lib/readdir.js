
(function(module) {

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
         var filterRegex = new RegExp(
            filter.replace(/\./g, '\\.')
               .replace(/(.)?(\*)(.)?/g, function(match, prefix, star, suffix, offset, string) {
                  if(prefix == '*' || suffix == '*') {
                     return match;
                  }
                  else {
                     return '[^\\/]*';
                  }
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
         return fs.statSync(path).nlink == 3;
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
    * @param {String[]} [appendTo]
    */
   function read_dir(dir, appendTo) {
      var contents = fs.readdirSync(dir),
         result = appendTo || [];

      contents.forEach(function(itm, index) {
         var newPath = dir + itm;
         if(is_dir(newPath)) {
            read_dir(newPath + '/', result);
         }
         else {
            if(result.indexOf(newPath) < 0) {
               result.push(newPath);
            }
         }
      });

      return result;
   }

   /**
    *
    * @param {String} rootDir
    * @param {String[]} [includeFilters]
    */
   module.exports.readSync = function(rootDir, includeFilters) {
      var allFiles = read_dir(dir, []);

      if(Array.isArray(includeFilters)) {
         allFiles = file_list_filter(allFiles, includeFilters);
      }

      return allFiles;
   };

   module.exports.isDir = is_dir;

}(typeof module == 'undefined' ? (window.ReadDir = {}) : module.exports));
