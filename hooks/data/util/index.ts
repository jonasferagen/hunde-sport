import { Category } from '@/models/Category';
import { Product, ProductData, ProductVariation, SimpleProduct, VariableProduct } from '@/models/Product';
import { cleanHtml } from '@/utils/helpers';
import { InfiniteData, useInfiniteQuery, UseInfiniteQueryOptions, UseInfiniteQueryResult } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';

export type InfiniteListQueryResult<T> = UseInfiniteQueryResult<InfiniteData<T[]>, Error> & { items: T[] };

export interface InfiniteListQueryOptions {
    autoload: boolean;
    enabled?: boolean;
}

export const useInfiniteListQuery = <T>(
    queryOptions: UseInfiniteQueryOptions<T[], Error, InfiniteData<T[]>, any, number>,
    options: InfiniteListQueryOptions = { autoload: false },
): InfiniteListQueryResult<T> => {
    const queryResult = useInfiniteQuery(queryOptions);

    useEffect(() => {

        if (options?.autoload) {
            const fetchAllPages = async () => {
                if (queryResult.hasNextPage && !queryResult.isFetchingNextPage) {
                    await queryResult.fetchNextPage();
                }
            };
            fetchAllPages();
        }
    }, [queryResult]);


    const items = useMemo(() => queryResult.data?.pages.flat() ?? [], [queryResult.data]);

    return { ...queryResult, items };
};


export const mapToCategory = (item: any): Category => new Category({
    id: item.id,
    name: item.name,
    parent: item.parent,
    image: item.image,
    description: item.description,
});

export const mapToProduct = (item: any): Product | ProductVariation => {
    try {

        const productData: ProductData = {
            id: item.id,
            name: cleanHtml(item.name),
            permalink: item.permalink,
            slug: item.slug,
            on_sale: item.on_sale,
            featured: item.featured || false,
            description: cleanHtml(item.description),
            short_description: cleanHtml(item.short_description || ''),
            sku: item.sku,
            price_html: item.price_html,
            prices: item.prices,
            images: item.images || [],
            categories: item.categories || [],
            tags: item.tags || [],
            attributes: (item.attributes || []).map((attr: any) => ({
                id: attr.id,
                name: attr.name,
                taxonomy: attr.taxonomy,
                has_variations: attr.has_variations,
                terms: attr.terms || [],
                variation: attr.has_variations || false,
            })),
            variations: item.variations || [],
            parent_id: item.parent_id || 0,
            type: item.type,
            is_in_stock: item.is_in_stock,
            is_purchasable: item.is_purchasable,
            has_options: item.has_options,
        };

        switch (productData.type) {
            case 'simple':
                return new SimpleProduct(productData);
            case 'variable':
                return new VariableProduct(productData);
            case 'variation':
                return new ProductVariation(productData);
            default:
                throw new Error(`Unknown product type: ${productData.type}`);
        }

    } catch (error) {
        console.error("Failed to map product:", item, error);
        throw error; // re-throw the error to be handled by the caller
    }
};