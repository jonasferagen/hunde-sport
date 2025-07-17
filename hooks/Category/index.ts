import { useStatus } from '@/contexts/StatusProvider';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { categoriesQueryOptions, categoryQueryOptions, categoryTrailQueryOptions } from './queries';



export const useCategoryTrail = (categoryId: number | null) => {
    return useQuery(categoryTrailQueryOptions(categoryId));
};

export const useCategories = (categoryId: number) => {
    const query = useInfiniteQuery(categoriesQueryOptions(categoryId));
    const { isError, refetch, data, fetchNextPage, hasNextPage, isFetchingNextPage } = query;
    const { showMessage } = useStatus();

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

    return {
        ...result,
        category: result.data,
    };
};
