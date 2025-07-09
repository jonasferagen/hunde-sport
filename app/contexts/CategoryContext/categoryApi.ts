import { ENDPOINTS } from '../../../config/api';
import apiClient from '../../../utils/apiClient';
import { mapToCategory } from './categoryUtils';

export async function fetchCategoryData(CategoryId: number, pageNum: number) {
    const { data, error } = await apiClient.get<any[]>(
        ENDPOINTS.CATEGORIES.LIST(pageNum, CategoryId)
    );

    if (error) throw new Error(error);

    return data?.map(mapToCategory) ?? [];
}

export default fetchCategoryData;