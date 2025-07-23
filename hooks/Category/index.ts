import { InfiniteListQueryOptions, useInfiniteListQuery } from '@/hooks/Query';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { categoriesQueryOptions, categoryQueryOptions } from './queries';

export const useCategories = (categoryId: number, options?: InfiniteListQueryOptions) => {
    return useInfiniteListQuery(categoriesQueryOptions(categoryId), options);
};

export const useCategory = (categoryId: number) => {
    const result = useQuery(categoryQueryOptions(categoryId));
    const category = useMemo(() => result.data, [result.data]);

    return {
        ...result,
        category,
    };
};

/*     @TODO can this be thrown and caught at a higher level?
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
        const { showMessage } = useStatusContext();

    const { showMessage } = useStatusContext();

}, [hasNextPage, fetchNextPage, isFetchingNextPage, data]); */