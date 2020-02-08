
export enum ReadDirOptions {
    /**
     * Bitwise option for making the return paths absolute URIs instead of being from the supplied base path
     */
    ABSOLUTE_PATHS = 1,

    /**
     * Bitwise option for making the return array sorted case insensitively
     */
    CASELESS_SORT = 2,

    /**
     * Bitwise option for making the return array sorted case sensitively
     */
    CASE_SORT = 4,

    /**
     * Bitwise option for making the return array sorted case sensitively
     */
    INCLUDE_DIRECTORIES = 8,

    /**
     * Bitwise option for preventing the automatic removal of paths that start with a dot
     */
    INCLUDE_HIDDEN = 16,

    /**
     * Bitwise option for preventing the directory reader running recursively
     */
    NON_RECURSIVE = 32,

    /**
     * Bitwise option for preventing errors reading directories from aborting the scan whenever possible - includes
     * incorrectly rooted relative symlinks and missing root directory.
     */
    IGNORE_ERRORS = 64,
}


export const ABSOLUTE_PATHS = ReadDirOptions.ABSOLUTE_PATHS;
export const CASELESS_SORT = ReadDirOptions.CASELESS_SORT;
export const CASE_SORT = ReadDirOptions.CASE_SORT;
export const INCLUDE_DIRECTORIES = ReadDirOptions.INCLUDE_DIRECTORIES;
export const INCLUDE_HIDDEN = ReadDirOptions.INCLUDE_HIDDEN;
export const NON_RECURSIVE = ReadDirOptions.NON_RECURSIVE;
export const IGNORE_ERRORS = ReadDirOptions.IGNORE_ERRORS;

