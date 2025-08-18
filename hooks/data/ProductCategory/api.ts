import { ENDPOINTS, PaginationOptions } from '@/config/api';
import { mapToProductCategory } from '@/domain/ProductCategory';
import { apiClient } from '@/lib/apiClient';
import { responseTransformer } from '../util';

export async function fetchProductCategories(pagination?: PaginationOptions) {
    const response = await apiClient.get<any[]>(
        ENDPOINTS.CATEGORIES.LIST(pagination)
    );
    return responseTransformer(response, mapToProductCategory);
}