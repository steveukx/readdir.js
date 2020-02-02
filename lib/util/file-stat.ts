import { stat, Stats } from 'fs';

export function fileStat(path: string): Promise<Stats> {
    return new Promise<Stats>((done, fail) => {
        stat(path, (err, result) => {
            err ? fail(err) : done(result);
        });
    });
}
