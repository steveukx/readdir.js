import { ReadDirOptions } from '../read-dir-options';

export type DefferedResolve<DATA = string[]> = (data: DATA) => void;

export type DefferedReject<ERR = Error> = (error: ERR) => void;

export function deferred_error_with_data<DATA = string[]>(
    done: DefferedResolve<DATA>,
    fail: DefferedReject,
    data: DATA,
    error: Error,
    options: number) {

    if (ReadDirOptions.IGNORE_ERRORS & options) {
        done(data);
    }
    else {
        fail(error);
    }
}

export function deferred_error(
    done: DefferedResolve,
    fail: DefferedReject,
    error: Error,
    options: number) {

    deferred_error_with_data(done, fail, [], error, options);
}
