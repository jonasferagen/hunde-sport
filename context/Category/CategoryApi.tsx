import { ENDPOINTS } from '@/config/api';
import { Category } from '@/types';
import apiClient from '@/utils/apiClient';

const mapToCategory = (item: any): Category => ({
    id: item.id,
    name: item.name,
    parent: item.parent,
    image: item.image,
});

export async function fetchCategoryByCategory(categoryId: number, pageNum: number) {
    const { data, error } = await apiClient.get<any[]>(
        ENDPOINTS.CATEGORIES.BYCATEGORY(categoryId, pageNum)
    );

    if (error) throw new Error(error);
    return (data ?? []).map(mapToCategory);
}

export async function fetchCategory(id: number) {
    const { data, error } = await apiClient.get<any>(
        ENDPOINTS.CATEGORIES.GET(id)
    );

    if (error) throw new Error(error);
    if (!data) throw new Error(`Category with id ${id} not found`);
    return mapToCategory(data);
}
