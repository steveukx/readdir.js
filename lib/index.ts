import { ReadDirOptions } from './read-dir-options';

export { read, readSync, isDir } from './read-dir';

export const ABSOLUTE_PATHS = ReadDirOptions.ABSOLUTE_PATHS;
export const CASELESS_SORT = ReadDirOptions.CASELESS_SORT;
export const CASE_SORT = ReadDirOptions.CASE_SORT;
export const INCLUDE_DIRECTORIES = ReadDirOptions.INCLUDE_DIRECTORIES;
export const INCLUDE_HIDDEN = ReadDirOptions.INCLUDE_HIDDEN;
export const NON_RECURSIVE = ReadDirOptions.NON_RECURSIVE;
export const IGNORE_ERRORS = ReadDirOptions.IGNORE_ERRORS;
