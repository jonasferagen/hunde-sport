import { InfiniteData, useInfiniteQuery, UseInfiniteQueryOptions, UseInfiniteQueryResult } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';

export type InfiniteListQueryResult<T> = UseInfiniteQueryResult<InfiniteData<{ items: T[], total: number }>, Error> & { items: T[], total: number };

export interface InfiniteListQueryOptions {
    autoload: boolean;
    enabled?: boolean;
}

export const useInfiniteListQuery = <T>(
    queryOptions: UseInfiniteQueryOptions<{ items: T[], total: number }, Error, InfiniteData<{ items: T[], total: number }>, any, number>,
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


    const items = useMemo(() => queryResult.data?.pages.flatMap(page => page.items) ?? [], [queryResult.data]);
    const total = useMemo(() => queryResult.data?.pages[0]?.total ?? 0, [queryResult.data]);

    return { ...queryResult, items, total };
};
