import { UseInfiniteQueryResult } from '@tanstack/react-query';
import { ApiResponse } from 'apisauce';
import React from 'react';

export type QueryResult<T> = Omit<UseInfiniteQueryResult<T>, 'data'> & {
    total: number;
    totalPages: number;
    items: T[];
};

export type Page<T> = {
    data: T[];
    totalPages: number;
    total: number;
}


/**
 * Transforms an API response into a standardized format with pagination and mapped data.
 *
 * @template T - The type of the mapped data items.
 * @param response - The ApiResponse object from apisauce.
 * @param mapper - A function to map each item in the response data array.
 * @returns An object containing the mapped data, total pages, and total item count.
 */
export const responseTransformer = <T>(response: ApiResponse<any>, mapper: (item: any) => T) => {
    if (response.problem) {
        throw new Error(response.problem);
    }

    const totalPages = Number(response.headers?.['x-wp-totalpages']);
    const total = Number(response.headers?.['x-wp-total']);

    return {
        data: (response.data ?? []).map(mapper),
        totalPages,
        total
    };
}


export const makeQueryOptions = <T>() => {
    return {
        //  placeHolderData: (prev: QueryResult<T>) => prev,
        initialPageParam: 1,
        getNextPageParam: (lastPage: Page<T>, allPages: Page<T>[]) => {
            if (!lastPage?.totalPages) return undefined;
            const nextPage = allPages.length + 1;
            return nextPage <= lastPage.totalPages ? nextPage : undefined;
        }
    };
};


export const handleQueryResult = <T extends { id: number }>(
    result: UseInfiniteQueryResult<any, any>
): QueryResult<T> => {
    const { data: dataResult, ...rest } = result;

    const data = React.useMemo(() => {
        const pages = dataResult?.pages ?? [];

        const indexById = new Map<number, number>();
        const items: T[] = [];

        for (const page of pages) {
            for (const item of page.data as T[]) {
                const idx = indexById.get(item.id);
                if (idx === undefined) {
                    indexById.set(item.id, items.length);
                    items.push(item);
                } else {
                    // same id appeared again (refetch/overlap) → update in place
                    items[idx] = item;
                }
            }
        }

        const last = pages.length ? pages[pages.length - 1] : null;
        return {
            total: last?.total ?? 0,
            totalPages: last?.totalPages ?? 0,
            items,
        };
    }, [dataResult?.pages]);

    return { ...rest, ...data };
};

