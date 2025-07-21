import { ENDPOINTS, PAGE_SIZE } from '@/config/api';
import { Product, ProductData, ProductType } from '@/models/Product';
import apiClient from '@/utils/apiClient';
import { cleanHtml, cleanNumber } from '@/utils/helpers';

const mapToProduct = (item: any): Product => {
    try {

        const productData: ProductData = {
            id: item.id,
            name: cleanHtml(item.name),
            price: cleanNumber(item.price),
            on_sale: item.on_sale,
            regular_price: cleanNumber(item.regular_price),
            sale_price: cleanNumber(item.sale_price),
            featured: item.featured || false,
            stock_status: item.stock_status,
            description: cleanHtml(item.description),
            short_description: cleanHtml(item.short_description || ''),
            categories: item.categories || [],
            images: item.image ? [item.image] : item.images || [], // Needed for non-standard api response when getting product variations 
            attributes: (item.attributes || []).map((attr: any) => ({
                ...attr,
                options: (attr.options || []).map(cleanHtml),
            })),
            variations: item.variations || [],
            related_ids: item.related_ids || [],
            type: item.type as ProductType,
            default_attributes: (item.default_attributes || []).map((attr: any) => ({
                ...attr,
                options: (attr.options || []).map(cleanHtml),
            })),
            parent_id: item.parent_id,
        };

        return new Product(productData);
    } catch (error) {
        console.error('Failed to map product. Item:', item, 'Error:', error);
        throw new Error(`Failed to map product with ID ${item.id}.`);
    }
};

export type ProductListType = 'featured' | 'recent' | 'discounted';

function getQueryStringForType(type: ProductListType): string {
    switch (type) {
        case 'featured':
            return 'featured=true&min_price=1';
        case 'recent':
            return 'orderby=date&min_price=1';
        case 'discounted':
            return 'on_sale=true&min_price=1';
    }
}

export async function fetchProducts(
    page: number,
    type: ProductListType
): Promise<Product[]> {
    const queryString = getQueryStringForType(type);
    const { data, error } = await apiClient.get<any[]>(
        ENDPOINTS.PRODUCTS.LIST(page, queryString)
    );

    if (error) throw new Error(error);
    return (data ?? []).map(mapToProduct);
}

export async function fetchProductByCategory(page: number, categoryId: number): Promise<Product[]> {
    const { data, error } = await apiClient.get<any[]>(
        ENDPOINTS.PRODUCTS.LIST(page, 'category=' + categoryId)
    );

    if (error) throw new Error(error);
    return (data ?? []).map(mapToProduct);
}

export async function searchProducts(page: number, query: string): Promise<Product[]> {
    const { data, error } = await apiClient.get<any[]>(
        ENDPOINTS.PRODUCTS.LIST(page, `search=${query}`)
    );
    if (error) throw new Error(error);
    return (data ?? []).map(mapToProduct);
}

export async function fetchProductsByIds(page: number, ids: number[]): Promise<Product[]> {
    if (ids.length === 0) {
        return [];
    }
    const { data, error } = await apiClient.get<any[]>(
        ENDPOINTS.PRODUCTS.LIST(page, `include=${ids.join(',')}`)
    );
    if (error) throw new Error(error);
    return (data ?? []).map(mapToProduct);
}

export async function fetchProductVariations(page: number, productId: number): Promise<Product[]> {
    const { data, error } = await apiClient.get<any[]>(
        ENDPOINTS.PRODUCTS.VARIATIONS(productId) + `?page=${page}&per_page=${PAGE_SIZE}`
    );
    if (error) throw new Error(error);
    return (data ?? []).map(mapToProduct);
}

export async function fetchProduct(id: number): Promise<Product> {
    const { data, error } = await apiClient.get<any>(ENDPOINTS.PRODUCTS.GET(id));
    if (error) throw new Error(error);
    return mapToProduct(data);
}
