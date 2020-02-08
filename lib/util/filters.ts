/**
 * For the supplied paths list, matches against the supplied filters and returns a new array of paths that
 * are ordered as the list of filters would imply they should be. The filters can include * as a match-anything in
 * one directory or ** for match any file in any directory. All filters are treated as an ends-with match.
 */
import { ReadDirOptions } from '../read-dir-options';
import { case_sort, caseless_sort, sort_paths } from './sort';
import { resolve } from 'path';

export function file_list_filter(paths: string[], filters: string[]): string[] {
    if (!filters.length) {
        return paths;
    }

    return filters.reduce((result: string[], filter: string) => {

        const filterRegex = regularExpressionFromFilter(filter);

        paths.forEach((path: string) => {
            if (result.indexOf(path) < 0 && path.match(filterRegex)) {
                result.push(path);
            }
        });

        return result;

    }, []);
}

/**
 * Changes the values in the supplied paths array to be absolute URIs
 */
export function prepend_paths(prefix: string, paths: string[]) {
    paths.forEach((path, index) => paths[index] = prefix + path);
}


export function apply_filters(basePath: string, allFiles: string[], includeFilters: string[], options: number): string[] {
    if (Array.isArray(includeFilters)) {
        allFiles = file_list_filter(allFiles, includeFilters);
    }

    if (ReadDirOptions.ABSOLUTE_PATHS & options) {
        prepend_paths(resolve(process.cwd(), basePath) + '/', allFiles);
    }

    if (ReadDirOptions.CASELESS_SORT & options) {
        allFiles = sort_paths(allFiles, caseless_sort);
    }

    if (ReadDirOptions.CASE_SORT & options) {
        allFiles = sort_paths(allFiles, case_sort);
    }

    return allFiles;
}

function regularExpressionFromFilter(filter: string): RegExp {
    return new RegExp('^' +
        filter.replace(/\./g, '\\.')
            .replace(/(\*?)(\*)(?!\*)/g, regularExpressionMatch)
            .replace(/\*\*/g, '\.*') + '$'
        , 'i');
}

function regularExpressionMatch(match: string, prefix: string): string {
    return prefix === '*' ? match : '[^\\/]*';
}
