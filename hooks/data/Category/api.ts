import { ENDPOINTS } from '@/config/api';
import apiClient from '@/utils/apiClient';

import { mapToCategory } from '@/hooks/data/util';

export async function fetchCategoryByCategory(page: number, categoryId: number) {

    const { data, error } = await apiClient.get<any[]>(
        ENDPOINTS.CATEGORIES.LIST(page, 'parent=' + categoryId)
    );

    if (error) throw new Error(error);
    return (data ?? []).map(mapToCategory);
}

export async function fetchCategoryById(id: number) {
    const { data, error } = await apiClient.get<any>(
        ENDPOINTS.CATEGORIES.GET(id)
    );

    if (error) throw new Error(error);
    if (!data) throw new Error(`Category with id ${id} not found`);
    return mapToCategory(data);
}
