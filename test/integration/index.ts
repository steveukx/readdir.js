import { join } from 'path';

function integrationDirectory(path: string): string {
    return join(__dirname, `${path}_dir`);
}

export function allExampleFilesCaselessSorted(): string[] {
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

export const allNestedExampleJavaScriptFiles = () => exampleJavaScriptFiles(true);

export const allExampleJavaScriptFiles = () => exampleJavaScriptFiles(false);

function exampleJavaScriptFiles(nestedOnly: boolean): string[] {
    return [
        'AAA/aaa.js',
        ...(nestedOnly ? [] : ['abc.js']),
        'BBB/bbb.js',
        'CCC/ccc.js',
        'CCC/DDD/ddd.js',
    ];
}

export function allErrorFiles(withHidden = false): string[] {
    return [
        ...(withHidden ? ['.hidden'] : []),
        'b.txt',
    ];
}

export const CASE_SENSITIVE_DIR = integrationDirectory('case_sensitive');
export const ERROR_DIR = integrationDirectory('error');
export const EXAMPLE_DIR = integrationDirectory('example');
