export type SortComparatorResult = -1 | 0 | 1;

export interface SortComparator<T = string> {
    (a: T, b: T): SortComparatorResult;
}

export function sort_paths(paths: string[], sorter: SortComparator) {
    return paths.sort(sorter);
}

export const caseless_sort: SortComparator<string> = (pathA: string, pathB: string) => {
    const a = ('' + pathA).toLowerCase();
    const b = ('' + pathB).toLowerCase();

    if (a == b) {
        return 0;
    }

    return a > b ? 1 : -1;
};

export const case_sort: SortComparator = (pathA: string, pathB: string) => {
    if (pathA == pathB) {
        return 0;
    }

    return pathA > pathB ? 1 : -1;
};

