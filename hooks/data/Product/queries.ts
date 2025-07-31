import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';
import {
    fetchProduct,
    fetchProducts,
    ProductListParams
} from './api';

import { PAGE_SIZE } from '@/config/api';

export const productQueryOptions = (productId: number) =>
    queryOptions({
        queryKey: ['product', productId],
        queryFn: () => fetchProduct(productId),
    });

export const productsQueryOptions = (query: ProductListParams) => {

    return infiniteQueryOptions({
        queryKey: ['products', query.type, query.params],
        queryFn: ({ pageParam = 1 }) => fetchProducts(pageParam, query),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length === PAGE_SIZE ? allPages.length + 1 : undefined;
        },
    });
}
