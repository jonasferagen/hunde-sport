import { ENDPOINTS } from '@/config/api';
import api from '@/lib/apiClient';
import { mapToProductCategory } from '@/models/ProductCategory';

export async function fetchCategories(page: number) {
    const response = await api.get<any[]>(
        ENDPOINTS.CATEGORIES.LIST(page)
    );

    if (response.problem) {
        throw new Error(response.problem);
    }

    const total = response.headers?.['x-wp-total'] as string | undefined;
    const totalPages = response.headers?.['x-wp-totalpages'] as string | undefined;

    return {
        items: (response.data ?? []).map(mapToProductCategory),
        total: total ? parseInt(total, 10) : 0,
        totalPages: totalPages ? parseInt(totalPages, 10) : 0,
    };
}
