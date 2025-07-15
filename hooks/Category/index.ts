import { Category } from '@/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useInfiniteListQuery } from '../useInfiniteListQuery';
import { fetchCategoryByCategory, fetchCategoryById } from './api';

export const useCategoryTrail = (categoryId: number | null) => {
    const queryClient = useQueryClient();

    return useQuery<Category[], Error>({
        queryKey: ['categoryTrail', categoryId],
        queryFn: async () => {
            if (!categoryId) return [];

            const trail: Category[] = [];
            let currentCategoryId: number | null = categoryId;

            while (currentCategoryId !== null && currentCategoryId !== 0) {
                const category: Category = await queryClient.fetchQuery({
                    queryKey: ['category', currentCategoryId],
                    queryFn: () => fetchCategoryById(currentCategoryId!),
                });
                trail.unshift(category);
                currentCategoryId = category.parent;
            }
            return trail;
        },
        enabled: !!categoryId, // Only run the query if categoryId is not null or 0
    });
};

export const useCategories = (categoryId: number) => {
    const { items: categories, ...rest } = useInfiniteListQuery<Category>(
        'category',
        ['categoriesByCategory', categoryId],
        (pageParam) => fetchCategoryByCategory(pageParam, categoryId)
    );

    return { ...rest, categories };
};

export const useCategory = (categoryId: number | string) => {
    const id = Number(categoryId);
    const result = useQuery<Category>({
        queryKey: ['category', id],
        queryFn: () => fetchCategoryById(id)
    });

    const category = result.data;

    return {
        ...result, category
    };
}
