import { ENDPOINTS } from '@/config/api';
import { Product, ProductData, ProductType } from '@/models/Product';
import apiClient from '@/utils/apiClient';
import { cleanHtml, cleanNumber } from '@/utils/helpers';

const mapToProduct = (item: any): Product => {
    const otherAttributes = item.attributes.filter((attr: any) => attr.variation === false);
    if (otherAttributes.length > 0) {
        console.log('------', otherAttributes, item.attributes);
    }

    const productData: ProductData = {
        id: item.id,
        name: cleanHtml(item.name),
        price: cleanNumber(item.price),
        on_sale: item.on_sale,
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
        parent_id: item.parent_id,
    };

    return new Product(productData);
};

export type ProductListType = 'featured' | 'recent' | 'discounted' | 'search' | 'category';

interface FetchProductsOptions {
    searchQuery?: string;
    categoryId?: number;
}

function getQueryStringForType(
    type: ProductListType,
    options: FetchProductsOptions
): string {
    switch (type) {
        case 'featured':
            return 'featured=true&min_price=1';
        case 'recent':
            return 'orderby=date&min_price=1';
        case 'discounted':
            return 'on_sale=true&min_price=1';
        case 'search':
            return `search=${options.searchQuery}&min_price=1`;
        case 'category':
            return `category=${options.categoryId}&min_price=1`;
    }
}

export async function fetchProducts(
    page: number,
    type: ProductListType,
    options: FetchProductsOptions = {}
): Promise<Product[]> {
    const queryString = getQueryStringForType(type, options);
    const { data, error } = await apiClient.get<any[]>(
        ENDPOINTS.PRODUCTS.LIST(page, queryString)
    );

    if (error) throw new Error(error);
    return (data ?? []).map(mapToProduct);
}

export async function fetchProduct(id: number): Promise<Product> {
    const { data, error } = await apiClient.get<any>(ENDPOINTS.PRODUCTS.GET(id));
    if (error) throw new Error(error);
    return mapToProduct(data);
}
