import { join } from 'path';
import { ReadDirOptions } from '../lib/read-dir-options';
import { readSync } from '../lib/read-dir';
import { CASE_SENSITIVE_DIR, EXAMPLE_DIR } from './integration';

describe('supplying options', () => {

    test('not supplied for defaults', () => {
        expect(readSync(EXAMPLE_DIR, ['*.txt'])).toEqual([
            'abc.txt',
        ]);
    });

    test('as a single number', () => {
        const options = ReadDirOptions.INCLUDE_HIDDEN + ReadDirOptions.ABSOLUTE_PATHS + ReadDirOptions.IGNORE_ERRORS;
        expect(readSync(EXAMPLE_DIR, ['*.txt'], options)).toEqual([
            join(EXAMPLE_DIR, 'abc.txt'),
        ]);
    });

    test('as an array of constants', () => {
        const options = [
            ReadDirOptions.INCLUDE_HIDDEN,
            ReadDirOptions.ABSOLUTE_PATHS,
            ReadDirOptions.IGNORE_ERRORS,
        ];
        expect(readSync(EXAMPLE_DIR, ['*.txt'], options)).toEqual([
            join(EXAMPLE_DIR, 'abc.txt'),
        ]);
    });

});

describe('output options', () => {

    test('absolute paths', () => {
        expect(readSync(EXAMPLE_DIR, ['BBB/*'], ReadDirOptions.ABSOLUTE_PATHS + ReadDirOptions.CASELESS_SORT)).toEqual([
            join(EXAMPLE_DIR, 'BBB', 'bbb.js'),
            join(EXAMPLE_DIR, 'BBB', 'bbb.txt'),
        ]);
    });

    test('case sensitive sort', () => {
        expect(readSync(CASE_SENSITIVE_DIR, null, ReadDirOptions.CASELESS_SORT)).toEqual([
            'aBC.xml', 'Abc.xsl',
        ]);

        expect(readSync(CASE_SENSITIVE_DIR, null, ReadDirOptions.CASE_SORT)).toEqual([
            'Abc.xsl', 'aBC.xml',
        ]);
    });

    test('include directories in output', () => {
        const options = ReadDirOptions.INCLUDE_DIRECTORIES + ReadDirOptions.CASELESS_SORT;
        expect(readSync(EXAMPLE_DIR, null, options)).toEqual([
            'AAA/',
            'AAA/aaa.js',
            'AAA/aaa.txt',
            'abc.js',
            'abc.txt',
            'BBB/',
            'BBB/bbb.js',
            'BBB/bbb.txt',
            'CCC/',
            'CCC/ccc.js',
            'CCC/ccc.txt',
            'CCC/DDD/',
            'CCC/DDD/ddd.js',
            'CCC/DDD/ddd.txt',
        ])
    });

    test('Non-recursive prevents reading into directories', () => {
        const options = [
            ReadDirOptions.INCLUDE_DIRECTORIES,
            ReadDirOptions.CASELESS_SORT,
            ReadDirOptions.NON_RECURSIVE,
        ];
        expect(readSync(EXAMPLE_DIR, null, options)).toEqual([
            'AAA/',
            'abc.js',
            'abc.txt',
            'BBB/',
            'CCC/',
        ]);
    });

});
