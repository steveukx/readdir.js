import { readSync } from '../lib/read-dir';
import {
    allExampleFilesCaselessSorted,
    allExampleJavaScriptFiles,
    allNestedExampleJavaScriptFiles,
    EXAMPLE_DIR
} from './integration';
import { ReadDirOptions } from '../lib/read-dir-options';

describe('synchronous path and name filtering', () => {

    test('omit filters to retrieve all files', () => {

        expect(readSync(EXAMPLE_DIR, null, ReadDirOptions.CASELESS_SORT))
            .toEqual(allExampleFilesCaselessSorted());

    });

    test('double star slash prefix to search at any depth', () => {

        const actual = readSync(EXAMPLE_DIR, ['**/**.js'], ReadDirOptions.CASELESS_SORT);

        expect(actual).toEqual(allNestedExampleJavaScriptFiles());

    });

    test('double star dot to search for an extension at any depth', () => {

        const actual = readSync(EXAMPLE_DIR, ['**.js'], ReadDirOptions.CASELESS_SORT);

        expect(actual).toEqual(allExampleJavaScriptFiles());

    });

    test('Single star ignores sub-directories and filename is a suffix', () => {
        expect(readSync(EXAMPLE_DIR, ['*.txt'])).toEqual([
            'abc.txt',
        ]);
    });

    test('path prefix requires that directory, trailing star allows any file type', () => {
        expect(readSync(EXAMPLE_DIR, ['BBB/*'], ReadDirOptions.CASELESS_SORT)).toEqual([
            'BBB/bbb.js',
            'BBB/bbb.txt',
        ]);
    });

    test('Path prefix requires that directory, trailing single star ignores subsequent sub-directories', () => {
        expect(readSync(EXAMPLE_DIR, ['CCC/*'], ReadDirOptions.CASELESS_SORT)).toEqual([
            'CCC/ccc.js',
            'CCC/ccc.txt',
        ]);
    });

    test('Trailing double star includes subsequent sub-directories', () => {
        expect(readSync(EXAMPLE_DIR, ['CCC/**'], ReadDirOptions.CASELESS_SORT)).toEqual([
            'CCC/ccc.js',
            'CCC/ccc.txt',
            'CCC/DDD/ddd.js',
            'CCC/DDD/ddd.txt',
        ]);
    });

});
