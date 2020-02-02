import { read, readSync } from '../lib/read-dir';
import { join } from 'path';
import { ReadDirOptions } from '../lib/read-dir-options';
import { read_dir } from '../lib/util/directory';

let errorDirPath: string;
let exampleDirPath: string;
let caseSensitiveDirPath: string;

beforeEach(() => {
    errorDirPath = join(__dirname, 'error_dir');
    exampleDirPath = join(__dirname, 'example_dir');
    caseSensitiveDirPath = join(__dirname, 'case_sensitive_dir');
});

describe('supplying options', () => {

    test('not supplied for defaults', () => {
        expect(readSync(exampleDirPath, ['*.txt'])).toEqual([
            'abc.txt',
        ]);
    });

    test('as a single number', () => {
        const options = ReadDirOptions.INCLUDE_HIDDEN + ReadDirOptions.ABSOLUTE_PATHS + ReadDirOptions.IGNORE_ERRORS;
        expect(readSync(exampleDirPath, ['*.txt'], options)).toEqual([
            join(exampleDirPath, 'abc.txt'),
        ]);
    });

    test('as an array of constants', () => {
        const options = [
            ReadDirOptions.INCLUDE_HIDDEN,
            ReadDirOptions.ABSOLUTE_PATHS,
            ReadDirOptions.IGNORE_ERRORS,
        ];
        expect(readSync(exampleDirPath, ['*.txt'], options)).toEqual([
            join(exampleDirPath, 'abc.txt'),
        ]);
    });

});

describe('synchronous path and name filtering', () => {

    test('omit filters to retrieve all files', () => {

        expect(readSync(exampleDirPath, null, ReadDirOptions.CASELESS_SORT)).toEqual([
            'AAA/aaa.js',
            'AAA/aaa.txt',
            'abc.js',
            'abc.txt',
            'BBB/bbb.js',
            'BBB/bbb.txt',
            'CCC/ccc.js',
            'CCC/ccc.txt',
            'CCC/DDD/ddd.js',
            'CCC/DDD/ddd.txt',
        ]);

    });

    test('double star slash prefix to search at any depth', () => {

        const actual = readSync(exampleDirPath, ['**/**.js'], ReadDirOptions.CASELESS_SORT);

        expect(actual).toEqual([
            'AAA/aaa.js',
            'BBB/bbb.js',
            'CCC/ccc.js',
            'CCC/DDD/ddd.js',
        ]);

    });

    test('double star dot to search for an extension at any depth', () => {

        const actual = readSync(exampleDirPath, ['**.js'], ReadDirOptions.CASELESS_SORT);

        expect(actual).toEqual([
            'AAA/aaa.js',
            'abc.js',
            'BBB/bbb.js',
            'CCC/ccc.js',
            'CCC/DDD/ddd.js',
        ]);

    });

    test('Single star ignores sub-directories and filename is a suffix', () => {
        expect(readSync(exampleDirPath, ['*.txt'])).toEqual([
            'abc.txt',
        ]);
    });

    test('path prefix requires that directory, trailing star allows any file type', () => {
        expect(readSync(exampleDirPath, ['BBB/*'], ReadDirOptions.CASELESS_SORT)).toEqual([
            'BBB/bbb.js',
            'BBB/bbb.txt',
        ]);
    });

    test('Path prefix requires that directory, trailing single star ignores subsequent sub-directories', () => {
        expect(readSync(exampleDirPath, ['CCC/*'], ReadDirOptions.CASELESS_SORT)).toEqual([
            'CCC/ccc.js',
            'CCC/ccc.txt',
        ]);
    });

    test('Trailing double star includes subsequent sub-directories', () => {
        expect(readSync(exampleDirPath, ['CCC/**'], ReadDirOptions.CASELESS_SORT)).toEqual([
            'CCC/ccc.js',
            'CCC/ccc.txt',
            'CCC/DDD/ddd.js',
            'CCC/DDD/ddd.txt',
        ]);
    });

});

describe('synchronous output options', () => {

    test('absolute paths', () => {
        expect(readSync(exampleDirPath, ['BBB/*'], ReadDirOptions.ABSOLUTE_PATHS + ReadDirOptions.CASELESS_SORT)).toEqual([
            join(exampleDirPath, 'BBB', 'bbb.js'),
            join(exampleDirPath, 'BBB', 'bbb.txt'),
        ]);
    });

    test('case sensitive sort', () => {
        expect(readSync(caseSensitiveDirPath, null, ReadDirOptions.CASELESS_SORT)).toEqual([
            'aBC.xml', 'Abc.xsl',
        ]);

        expect(readSync(caseSensitiveDirPath, null, ReadDirOptions.CASE_SORT)).toEqual([
            'Abc.xsl', 'aBC.xml',
        ]);
    });

    test('include directories in output', () => {
        const options = ReadDirOptions.INCLUDE_DIRECTORIES + ReadDirOptions.CASELESS_SORT;
        expect(readSync(exampleDirPath, null, options)).toEqual([
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
        expect(readSync(exampleDirPath, null, options)).toEqual([
            'AAA/',
            'abc.js',
            'abc.txt',
            'BBB/',
            'CCC/',
        ])
    });

});

xdescribe('asynchronous', () => {

    xtest('read through the directory', async () => {
        const options = [
            ReadDirOptions.INCLUDE_DIRECTORIES,
            ReadDirOptions.CASE_SORT,
        ];
        const expected = await read(caseSensitiveDirPath, [], options);

        expect(expected).toEqual(['Abc.xsl', 'aBC.xml']);

    });

    test('Recursive read through the directory', async () => {
        const options = [
            ReadDirOptions.CASELESS_SORT,
        ];

        expect(await read(exampleDirPath, [], options)).toEqual(allExampleFilesCaselessSorted());

    });

});

describe('error states', () => {

    let fileStat: any;
    beforeEach(() => {
        let statCount = 0;
        let alwaysError = false;
        let errorAtIndex: number[] = [];

        fileStat = jest.fn(function (path: string) {
            const index = statCount++;

            if (alwaysError || errorAtIndex.includes(index)) {
                return Promise.reject(new Error('STAT FAIL'));
            }

            return Promise.resolve({ isDirectory() { return false; }} as any);
        });
        fileStat.alwaysError = () => {
            alwaysError = true;
            return fileStat;
        };
        fileStat.errorAtIndex = (index: number) => {
            errorAtIndex.push(index);
            return fileStat;
        };
    });

    test('stat errors', async () => {
        let err: any = undefined;

        try {
            await read_dir(errorDirPath, 0, 0, fileStat.errorAtIndex(1));
        }
        catch (e) {
            err = e;
        }

        expect(fileStat.mock.calls.length).toBe(3);
        expect(err).not.toBeUndefined();
    });

    test('stat errors ignored', async () => {
        let err: any = undefined;

        try {
            const options = ReadDirOptions.CASELESS_SORT + ReadDirOptions.IGNORE_ERRORS;
            const result = await read_dir(errorDirPath, errorDirPath.length + 1, options, fileStat.errorAtIndex(1));

            expect(result).toEqual(allErrorFiles(true));
        }
        catch (e) {
            err = e;
        }

        expect(fileStat.mock.calls.length).toBe(3);
        expect(err).toBeUndefined();
    });

});

function allExampleFilesCaselessSorted (): string[] {
    return [
        'AAA/aaa.js',
        'AAA/aaa.txt',
        'abc.js',
        'abc.txt',
        'BBB/bbb.js',
        'BBB/bbb.txt',
        'CCC/ccc.js',
        'CCC/ccc.txt',
        'CCC/DDD/ddd.js',
        'CCC/DDD/ddd.txt',
    ];
}

function allErrorFiles (withHidden = false): string[] {
    return [
        ...(withHidden ? ['.hidden'] : []),
        'b.txt',
    ];
}

