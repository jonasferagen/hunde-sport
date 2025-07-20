import { useStatusContext } from '@/contexts/StatusContext';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { categoriesQueryOptions, categoryQueryOptions } from './queries';

export const useCategories = (categoryId: number) => {
    const query = useInfiniteQuery(categoriesQueryOptions(categoryId));
    const { isError, refetch, data, fetchNextPage, hasNextPage, isFetchingNextPage } = query;
    const { showMessage } = useStatusContext();


    /* @TODO can this be thrown and caught at a higher level?*/
    useEffect(() => {
        if (isError) {
            showMessage({
                text: 'Could not load categories.',
                type: 'error',
                action: {
                    label: 'Retry',
                    onPress: () => refetch(),
                },
            });
        }
    }, [isError, refetch, showMessage]);

    useEffect(() => {
        const fetchAllPages = async () => {
            if (hasNextPage && !isFetchingNextPage) {
                await fetchNextPage();
            }
        };
        fetchAllPages();
    }, [hasNextPage, fetchNextPage, isFetchingNextPage, data]);


    const categories = useMemo(() => data?.pages.flat() ?? [], [data?.pages]);
    return { ...query, categories };
};

export const useCategory = (categoryId: number) => {
    const result = useQuery(categoryQueryOptions(categoryId));
    const category = useMemo(() => result.data, [result.data]);

    return {
        ...result,
        category,
    };
};
