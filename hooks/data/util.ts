import { UseInfiniteQueryResult } from '@tanstack/react-query';
import { ApiResponse } from 'apisauce';
import { useMemo } from 'react';

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

export const queryOptions = {
    placeholderData: (prev: any) => prev,
    initialPageParam: 1,
    getNextPageParam: (lastPage: any, allPages: any[]) => {
        if (!lastPage?.totalPages) return undefined;
        const nextPage = allPages.length + 1;
        return nextPage <= lastPage.totalPages ? nextPage : undefined;
    }
};


export type QueryResult<T> = Omit<UseInfiniteQueryResult<T>, 'data'> & {
    total: number;
    totalPages: number;
    items: T[];
};


export const handleQueryResult = <T>(result: UseInfiniteQueryResult<any, any>): QueryResult<T> => {

    const { data: dataResult, ...rest } = result;

    const data = useMemo(() => {
        const page = dataResult ? dataResult.pages[dataResult.pages.length - 1] : null;
        const total = page ? page.total : 0;
        const totalPages = page?.totalPages ?? 0;
        const items = dataResult?.pages.flatMap((page: any) => page.data) as T[];
        return { total, items, totalPages };
    }, [dataResult]);

    return {
        ...rest,
        ...data
    };
}
