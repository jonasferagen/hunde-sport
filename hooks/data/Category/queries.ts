import { fetchCategories } from './api';


const CATEGORIES_PER_PAGE = 100;

export const categoriesQueryOptions = () => ({
    queryKey: ['categories'],
    queryFn: ({ pageParam = 1 }) => fetchCategories(pageParam),
    getNextPageParam: (lastPage: any, allPages: any) => {
        // If the last page had items, there might be a next page.
        return lastPage.items.length > 0 ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
});
