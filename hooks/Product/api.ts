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

export type ProductListParams =
    | { type: 'recent' | 'featured' | 'discounted', params: undefined }
    | { type: 'search', params: string }
    | { type: 'category', params: number }
    | { type: 'ids', params: number[] };

export type ProductListType = ProductListParams['type'];

export function getQueryStringForType({ type, params }: ProductListParams): string {
    switch (type) {
        case 'recent':
            return 'orderby=date';
        case 'featured':
            return 'featured=true';
        case 'discounted':
            return 'on_sale=true';
        case 'search':
            return 'search=' + params;
        case 'category':
            return 'category=' + params;
        case 'ids':
            return 'include=' + params.join(',');
    }
}


export async function fetchProduct(id: number): Promise<Product> {
    const { data, error } = await apiClient.get<any>(ENDPOINTS.PRODUCTS.GET(id));
    if (error) throw new Error(error);
    return mapToProduct(data);
}

export async function fetchProducts(page: number, query: ProductListParams): Promise<Product[]> {
    const queryString = getQueryStringForType(query);
    const { data, error } = await apiClient.get<any[]>(
        ENDPOINTS.PRODUCTS.LIST(page, queryString)
    );
    console.log("--- products by query ---" + queryString);
    if (error) throw new Error(error);
    return (data ?? []).map(mapToProduct);
}


export async function fetchProductVariations(page: number, productId: number): Promise<Product[]> {
    const { data, error } = await apiClient.get<any[]>(
        ENDPOINTS.PRODUCTS.VARIATIONS(productId) + `?page=${page}&per_page=${PAGE_SIZE} `
    );
    console.log("--- product variations ---", productId);
    if (error) throw new Error(error);
    return (data ?? []).map(mapToProduct);
}
