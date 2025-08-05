import { ENDPOINTS, PaginationOptions } from '@/config/api';
import { apiClient } from '@/lib/apiClient';
import { mapToProductCategory } from '@/models/ProductCategory';
import { responseTransformer } from '../util';

export async function fetchProductCategories(pagination?: PaginationOptions) {
    const response = await apiClient.get<any[]>(
        ENDPOINTS.CATEGORIES.LIST(pagination)
    );
    return responseTransformer(response, mapToProductCategory);
}