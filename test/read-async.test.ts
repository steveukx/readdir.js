import { ReadDirOptions } from '../lib/read-dir-options';
import { read } from '../lib/read-dir';
import { allExampleFilesCaselessSorted, CASE_SENSITIVE_DIR, EXAMPLE_DIR } from './integration';

describe('asynchronous', () => {

    test('read through the directory', async () => {
        const options = [
            ReadDirOptions.INCLUDE_DIRECTORIES,
            ReadDirOptions.CASE_SORT,
        ];
        const expected = await read(CASE_SENSITIVE_DIR, [], options);

        expect(expected).toEqual(['Abc.xsl', 'aBC.xml']);

    });

    test('Recursive read through the directory', async () => {
        const options = [
            ReadDirOptions.CASELESS_SORT,
        ];

        expect(await read(EXAMPLE_DIR, [], options)).toEqual(allExampleFilesCaselessSorted());

    });

});
