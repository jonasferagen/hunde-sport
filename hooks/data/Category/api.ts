import { ENDPOINTS } from '@/config/api';
import apiClient from '@/utils/apiClient';

import { mapToProductCategory } from '@/models/ProductCategory';

export async function fetchCategories(page: number) {

    const { data, headers, error } = await apiClient.get<any[]>(
        ENDPOINTS.CATEGORIES.LIST(page)
    );

    const total = headers.get('X-WP-Total');
    const totalPages = headers.get('X-WP-TotalPages');

    if (error) throw new Error(error);

    return {
        items: (data ?? []).map(mapToProductCategory),
        total: total ? parseInt(total, 10) : 0,
    };
}
