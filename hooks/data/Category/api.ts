import { ENDPOINTS } from '@/config/api';
import apiClient from '@/utils/apiClient';

import { mapToCategory } from '@/models/Category';

export async function fetchCategories(page: number) {

    const { data, error } = await apiClient.get<any[]>(
        ENDPOINTS.CATEGORIES.LIST(page)
    );

    console.log("loading categories");


    if (error) throw new Error(error);
    return (data ?? [])
        .map(mapToCategory);
}

export async function fetchCategoryById(id: number) {
    const { data, error } = await apiClient.get<any>(
        ENDPOINTS.CATEGORIES.GET(id)
    );

    console.log("loading category by id", id);

    if (error) throw new Error(error);
    if (!data) throw new Error(`Category with id ${id} not found`);
    return mapToCategory(data);
}
