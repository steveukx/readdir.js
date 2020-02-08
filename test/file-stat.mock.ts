import { Stats } from 'fs';
import { FileStatFn } from '../lib/util/file-stat';

export interface FileStatMockFn extends FileStatFn {
    alwaysError (): FileStatMockFn;
    errorAtIndex (index: number): FileStatMockFn;
    calls (): any[][];
}

export const fileStatMock = (): FileStatMockFn => {

    let statCount = 0;
    let alwaysError = false;
    let errorAtIndex: number[] = [];

    const fileStat = jest.fn((path: string): Promise<Stats> => {
        const index = statCount++;

        if (alwaysError || errorAtIndex.includes(index)) {
            return Promise.reject(new Error('STAT FAIL'));
        }

        const stat: any = {
            $index: index,
            $path: path,

            isDirectory() {
                return false;
            },
        };

        return Promise.resolve(stat);
    });

    const mock: FileStatMockFn = Object.assign(fileStat, {
        alwaysError () {
            alwaysError = true;
            return mock;
        },
        errorAtIndex (index: number) {
            errorAtIndex.push(index);
            return mock;
        },
        calls () {
            return fileStat.mock.calls;
        },
    });

    return mock;

};
