
import { InfiniteData, useInfiniteQuery, UseInfiniteQueryOptions, UseInfiniteQueryResult } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';

export type InfiniteListQueryResult<T> = UseInfiniteQueryResult<InfiniteData<T[]>, Error> & { items: T[] };

export interface InfiniteListQueryOptions {
    autoload: boolean;
    enabled?: boolean;
}

export const useInfiniteListQuery = <T>(
    queryOptions: UseInfiniteQueryOptions<T[], Error, InfiniteData<T[]>, any, number>,
    options: InfiniteListQueryOptions = { autoload: false },
): InfiniteListQueryResult<T> => {
    const queryResult = useInfiniteQuery(queryOptions);

    useEffect(() => {

        if (options?.autoload) {
            const fetchAllPages = async () => {
                if (queryResult.hasNextPage && !queryResult.isFetchingNextPage) {
                    await queryResult.fetchNextPage();
                }
            };
            fetchAllPages();
        }
    }, [queryResult]);


    const items = useMemo(() => queryResult.data?.pages.flat() ?? [], [queryResult.data]);

    return { ...queryResult, items };
};

