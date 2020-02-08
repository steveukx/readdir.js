import { stat, Stats } from 'fs';

export type FileStatFn = (path: string) => Promise<Stats>;

export const fileStat: FileStatFn = (path) => {
    return new Promise<Stats>((done, fail) => {
        stat(path, (err, result) => {
            err ? fail(err) : done(result);
        });
    });
};
