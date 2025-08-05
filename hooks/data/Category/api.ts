import { ENDPOINTS } from '@/config/api';
import { apiClient } from '@/lib/apiClient';
import { mapToProductCategory } from '@/models/ProductCategory';

export async function fetchCategories() {
    const response = await apiClient.get<any[]>(
        ENDPOINTS.CATEGORIES.ALL()
    );

    if (response.problem) {
        throw new Error(response.problem);
    }

    const total = response.headers?.['x-wp-total'] as string | undefined;
    const totalPages = response.headers?.['x-wp-totalpages'] as string | undefined;

    return (response.data ?? []).map(mapToProductCategory);
}
