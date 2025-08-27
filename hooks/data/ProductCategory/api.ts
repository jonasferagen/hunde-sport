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

export async function fetchProductCategory(id: number) {
    const response = await apiClient.get<any[]>(
        ENDPOINTS.CATEGORIES.GET(id)
    );
    return mapToProductCategory(response.data);
}