import { ENDPOINTS } from '@/config/api';
import type { Product, ProductType } from '@/types';
import apiClient from '@/utils/apiClient';
import { cleanHtml, cleanNumber } from '@/utils/helpers';


const allowedKeys: (keyof Product)[] = [
    'id',
    'name',
    'price',
    'regular_price',
    'sale_price',
    'featured',
    'stock_status',
    'description',
    'short_description',
    'categories',
    'images',
    'attributes',
    'variations',
    'related_ids',
];

const mapToProduct = (item: any): Product => {
    const product: Partial<Product> = {};

    product.id = item.id;
    product.name = cleanHtml(item.name);
    product.price = cleanNumber(item.price);
    product.regular_price = cleanNumber(item.regular_price);
    product.sale_price = cleanNumber(item.sale_price);
    product.featured = item.featured;
    product.stock_status = item.stock_status;
    product.description = cleanHtml(item.description);
    product.short_description = cleanHtml(item.short_description);
    product.categories = item.categories || [];
    product.images = item.images || [];
    product.attributes = (item.attributes || []).map((attr: any) => ({
        ...attr,
        options: (attr.options || []).map(cleanHtml),
    }));
    product.variations = item.variations || [];
    product.related_ids = item.related_ids || [];
    product.type = item.type as ProductType;

    if (product.images!.length === 0) {
        product.images!.push({ src: 'https://placehold.co/600x400' });
    }

    return product as Product;
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
