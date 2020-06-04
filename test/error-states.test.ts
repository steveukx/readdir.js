import { read_dir } from '../lib/util/directory';
import { fileStatMock, FileStatMockFn } from './mocks/file-stat.mock';
import { ReadDirOptions } from '../lib';
import { allErrorFiles, ERROR_DIR } from './integration';

describe('error states', () => {

    let fileStat: FileStatMockFn;
    beforeEach(() => fileStat = fileStatMock());

    test('stat errors', async () => {
        let err: any = undefined;

        try {
            await read_dir(ERROR_DIR, 0, 0, fileStat.errorAtIndex(1));
        }
        catch (e) {
            err = e;
        }

        expect(fileStat.calls().length).toBe(3);
        expect(err).not.toBeUndefined();
    });

    test('stat errors ignored', async () => {
        let err: any = undefined;

        try {
            const options = ReadDirOptions.CASELESS_SORT + ReadDirOptions.IGNORE_ERRORS;
            const result = await read_dir(ERROR_DIR, ERROR_DIR.length + 1, options, fileStat.errorAtIndex(1));

            expect(result).toEqual(allErrorFiles(true));
        }
        catch (e) {
            err = e;
        }

        expect(fileStat.calls().length).toBe(3);
        expect(err).toBeUndefined();
    });

});

