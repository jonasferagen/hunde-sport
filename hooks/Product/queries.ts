import { Product } from '@/models/Product';
import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';
import {
    fetchProduct,
    fetchProducts,
    ProductListType,
} from './api';

import { PAGE_SIZE } from '@/config/api';

export const productQueryOptions = (productId: number) =>
    queryOptions({
        queryKey: ['product', productId],
        queryFn: () => fetchProduct(productId),
        enabled: !!productId,
    });

const productInfiniteQueryOptions = (
    queryKey: (string | number | object)[],
    queryFn: ({ pageParam }: { pageParam: number }) => Promise<Product[]>,
    options: { enabled?: boolean } = {}
) =>
    infiniteQueryOptions({
        queryKey,
        queryFn,
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            //return undefined;
            return lastPage.length === PAGE_SIZE ? allPages.length + 1 : undefined;
        },
        ...options,
    });

interface ProductsQueryArgs {
    type: ProductListType;
    categoryId?: number;
    searchQuery?: string;
}

export const productsQueryOptions = ({ type, categoryId, searchQuery }: ProductsQueryArgs) => {
    const queryKey = ['products', type, { categoryId, searchQuery }];

    const queryFn = ({ pageParam = 1 }) =>
        fetchProducts(pageParam, type, { categoryId, searchQuery });

    const options = { enabled: type !== 'search' || !!searchQuery };

    return productInfiniteQueryOptions(queryKey, queryFn, options);
};
