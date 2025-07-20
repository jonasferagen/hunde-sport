import { ENDPOINTS } from '@/config/api';
import { Product, ProductData, ProductType } from '@/models/Product';
import apiClient from '@/utils/apiClient';
import { cleanHtml, cleanNumber } from '@/utils/helpers';


const mapToProduct = (item: any): Product => {
    const productData: ProductData = {
        id: item.id,
        name: cleanHtml(item.name),
        price: cleanNumber(item.price),
        regular_price: cleanNumber(item.regular_price),
        sale_price: cleanNumber(item.sale_price),
        featured: item.featured,
        stock_status: item.stock_status,
        description: cleanHtml(item.description),
        short_description: cleanHtml(item.short_description),
        categories: item.categories || [],
        images: item.images || [],
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
    };

    return new Product(productData);
};

export async function fetchFeaturedProducts(page: number): Promise<Product[]> {
    const { data, error } = await apiClient.get<any[]>(
        ENDPOINTS.PRODUCTS.LIST(page, 'featured=true&min_price=1')
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

export async function fetchProduct(id: number): Promise<Product> {
    const { data, error } = await apiClient.get<any>(
        ENDPOINTS.PRODUCTS.GET(id)
    );
    if (error) throw new Error(error);
    return mapToProduct(data);
}
