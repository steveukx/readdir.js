import { readdir, readdirSync, Stats } from 'fs';
import { ReadDirOptions } from '../read-dir-options';
import { exists, FOLDER } from '@kwsites/file-exists';

type PathSearchResult = string | string[];


/**
 * Given the name of the directory about to be traversed, checks whether it should be - allows for the automatic
 * removal of "hidden" directories.
 *
 * @param {String} base
 * @param {String} directoryName
 * @param {Number} options
 * @return {Boolean}
 */

export function should_read_directory(base: string, directoryName: string, options: number) {
    return !(ReadDirOptions.NON_RECURSIVE & options) &&
        !!(directoryName.charAt(0) != '.' || (ReadDirOptions.INCLUDE_HIDDEN & options));
}

/**
 * Reads the supplied directory path and builds an array of files within the directory. This will work recursively
 * on each sub directory found. The optional appendTo argument can be used to merge file paths onto an existing
 * array, and is used internally for recursion.
 */
export function read_dir_sync(dir: string, appendTo: string[], prefixLength: number, options: number) {
    const contents = readdirSync(dir);
    const result = appendTo || [];

    contents.forEach(function (itm) {
        const newPath = dir + itm;

        if (is_dir(newPath)) {

            if (should_read_directory(dir, itm, options)) {
                read_dir_sync(newPath + '/', result, prefixLength, options);
            }

            if (ReadDirOptions.INCLUDE_DIRECTORIES & options) {
                result.push(newPath.substring(prefixLength) + '/');
            }
        }
        else {
            result.push(newPath.substring(prefixLength));
        }
    });

    return result;
}


export function read_dir(dir: string, prefixLength: number, options: number, fileStat: (path: string) => Promise<Stats>): Promise<string[]> {

    const appendTo: string[] = [];

    function directoryListingIterator(itm: string) {
        return new Promise(async (done, fail) => {
            const newPath = dir.replace(/\/$/, '') + '/' + itm;

            try {
                const stat = await fileStat(newPath);

                if (!stat) {
                    return deferred_error(done, fail, new Error(`Unable to stat file: "${newPath}"`), options);
                }

                const isDirectory = stat.isDirectory();

                if (!isDirectory) {
                    return done(appendTo.push(newPath.substring(prefixLength)));
                }

                if (ReadDirOptions.INCLUDE_DIRECTORIES & options) {
                    appendTo.push(newPath.substring(prefixLength) + '/');
                }

                if (should_read_directory(dir, itm, options)) {
                    appendTo.push(...(await read_dir(newPath, prefixLength, options, fileStat)));
                }

                done();
            }

            catch (e) {
                return deferred_error(done, fail, e, options);
            }
        });
    }

    return new Promise((done, fail) => {

        function directoryListing(err: Error | null, contents: string[]) {
            if (err) {
                return deferred_error_with_data(done, fail, appendTo, err, options);
            }

            if (!contents.length) {
                return done([]);
            }

            Promise.all(contents.map(directoryListingIterator))
                .then(() => done(appendTo))
                .catch((error: Error) => deferred_error_with_data(done, fail, appendTo, error, options));

        }

        readdir(dir, directoryListing);
    });
}

export type DefferedResolve<DATA = string[]> = (data: DATA) => void;
export type DefferedReject<ERR = Error> = (error: ERR) => void;

function deferred_error_with_data<DATA = string[]>(
    done: DefferedResolve<DATA>,
    fail: DefferedReject,
    data: DATA,
    error: Error,
    options: number) {

    if (ReadDirOptions.IGNORE_ERRORS & options) {
        done(data);
    }
    else {
        fail(error);
    }
}

function deferred_error(
    done: DefferedResolve,
    fail: DefferedReject,
    error: Error,
    options: number) {

    deferred_error_with_data(done, fail, [], error, options);
}


/**
 * Gets a flag that identifies whether the supplied path is a directory or a file, true when a directory. In the
 * case that the file doesn't exist the result will be false.
 *
 * @param path
 * @return {Boolean}
 */
function is_dir(path: string): boolean {
    return exists(path, FOLDER);
}

function flattenPaths(paths: PathSearchResult[]): string[] {

    const reduce = paths.reduce((all: string[], current: string | string[]) => {
        if (Array.isArray(current)) {
            all.push(...flattenPaths(current));
        }
        else if (typeof current === 'string') {
            all.push(current);
        }

        return all;
    }, []);

    return reduce;
}
