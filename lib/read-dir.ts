import { equal } from 'assert';
import { exists, FOLDER } from '@kwsites/file-exists';
import { sum } from '@kwsites/math-sum';

import { apply_filters } from './util/filters';
import { read_dir, read_dir_sync } from './util/directory';
import { ReadDirOptions } from './read-dir-options';
import { fileStat } from './util/file-stat';

interface ReadArgs {
    basePath: string;
    includeFilters: string[];
    options: number;
}

interface AsyncReadArgs extends ReadArgs {
    callback: ReadDirAsyncHandler;
}

export type Nullable<T> = T | null;

export type OptionsConfiguration = ReadDirOptions[] | number;

export type ReadDirAsyncHandler = (err: Nullable<Error>, result: string[]) => void;

export function readSync (basePath: string, includeFilters?: Nullable<string[]>, options?: OptionsConfiguration): string[] {
    const rootDir = basePath.replace(/\/$/, '') + '/';

    if (!exists(rootDir, FOLDER)) {
        return [];
    }

    const optionBits: number = toOptionBits(options);

    let allFiles = read_dir_sync(rootDir, [], rootDir.length, optionBits);

    return apply_filters(
        basePath,
        allFiles,
        includeFilters || [], optionBits);
}


export async function read (basePath: string, includeFilters?: string[], options?: OptionsConfiguration, handler?: ReadDirAsyncHandler): Promise<string[]> {
    const args = configureAsyncSearchArgs(
        basePath, includeFilters, options, handler
    );

    try {
        const rootDir = args.basePath.replace(/\/$/, '') + '/';
        const allFiles = await read_dir(rootDir, rootDir.length, args.options, fileStat);

        const filtered = apply_filters(
            args.basePath,
            allFiles,
            args.includeFilters, args.options);

        args.callback(null, filtered);

        return filtered;
    }
    catch (e) {
        args.callback(e, []);

        throw e;
    }

}

function configureAsyncSearchArgs (...args: any[]): AsyncReadArgs {
    const basePath: string = args.shift();
    equal(typeof basePath, 'string', 'basePath must be a string');

    for (let i = args.length - 1; i >= 0; i--) {
        if (args[i] === undefined) {
            args.pop();
        }
    }

    const callback: ReadDirAsyncHandler = typeof args[args.length - 1] === 'function' ? args.pop() : function () {};
    let includeFilters: string[] = [];
    let options: number = 0;

    if (args.length === 1) {
        if (isOptionsConfiguration(args[0])) {
            options = toOptionBits(args[0]);
        }
        else {
            includeFilters = args[0];
        }
    }
    else if (args.length === 2) {
        includeFilters = args.shift();
        options = toOptionBits(args.shift());
    }

    return {
        basePath,
        callback,
        includeFilters,
        options,
    };

}

function isOptionsConfiguration(test: any): test is OptionsConfiguration {
    return isNumber(test) || Array.isArray(test) && test.every(isNumber)
}

function toOptionBits (options?: OptionsConfiguration): number {
    return Array.isArray(options) ? sum(options) : options || 0;
}

function isNumber (test: any): test is number {
    return typeof test === 'number';
}

/**
 * @deprecated
 */
export function isDir (path: string): boolean {
    console.info(`Use of 'readdir.isDir' is deprecated, please replace with '@kwsites/file-exists'`);
    return exists(path, FOLDER);
}

