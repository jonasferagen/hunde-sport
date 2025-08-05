import { fetchCategories } from './api';


export const categoriesQueryOptions = () => ({
    queryKey: ['categories'],
    queryFn: () => fetchCategories(),
    getNextPageParam: (lastPage: any, allPages: any) => {
        // If the last page had items, there might be a next page.
        return lastPage.items.length > 0 ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
});
