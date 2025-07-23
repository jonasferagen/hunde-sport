import { InfiniteData, useInfiniteQuery, UseInfiniteQueryOptions } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';

export interface InfiniteListQueryOptions {
    autoload?: boolean;
}

export const useInfiniteListQuery = <T>(
    queryOptions: UseInfiniteQueryOptions<T[], Error, InfiniteData<T[]>, any, number>,
    options?: InfiniteListQueryOptions,
) => {
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
