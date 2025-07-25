import { Category } from '@/models/Category';
import { Product, ProductData, ProductType } from '@/models/Product';
import { ProductVariation } from '@/models/ProductVariation';
import { cleanHtml, cleanNumber } from '@/utils/helpers';
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
    count: item.count,
});

export const mapToProduct = (item: any): Product | ProductVariation => {
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

        if (productData.type === 'variation') {
            return new ProductVariation(productData);
        }

        return new Product(productData);
    } catch (error) {
        console.error('Failed to map product. Item:', item, 'Error:', error);
        throw new Error(`Failed to map product with ID ${item.id}.`);
    }
};