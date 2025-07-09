import { ENDPOINTS } from '../../../config/api';
import type { Product } from '../../../types';
import apiClient from '../../../utils/apiClient';
import { mapToProduct } from './productUtils';

export async function fetchProductList(productId: number, page: number): Promise<Product[]> {
    const { data, error } = await apiClient.get<any[]>(
        ENDPOINTS.PRODUCTS.LIST(page, productId)
    );
    if (error) throw new Error(error);
    return (data ?? []).map(mapToProduct);
}

export async function fetchProductDetail(productId: number): Promise<Product> {
    const { data, error } = await apiClient.get<any>(
        ENDPOINTS.PRODUCTS.GET(productId)
    );
    if (error) throw new Error(error);
    return mapToProduct(data);
}

export default fetchProductDetail;
