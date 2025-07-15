import { InfiniteData, QueryKey, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';

interface ListItem {
    id: number;
    [key: string]: any;
}

export const useInfiniteListQuery = <T extends ListItem>(
    entity: string,
    queryKey: QueryKey,
    queryFn: (pageParam: number) => Promise<T[]>,
    options: { enabled?: boolean } = {}
) => {
    const queryClient = useQueryClient();

    const queryResult = useInfiniteQuery<T[], Error, InfiniteData<T[]>, QueryKey, number>({
        queryKey,
        queryFn: ({ pageParam = 1 }) => queryFn(pageParam),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length === 10 ? allPages.length + 1 : undefined;
        },
        ...options,
    });

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = queryResult;

    const loadMore = useCallback(() => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    useEffect(() => {
        if (data) {
            data.pages.forEach(page => {
                page.forEach((item: T) => {
                    queryClient.setQueryData([entity, item.id], item);
                });
            });
        }
    }, [data, queryClient, entity]);

    const items = data?.pages.flat() ?? [];

    return { ...queryResult, items, loadMore };
};
