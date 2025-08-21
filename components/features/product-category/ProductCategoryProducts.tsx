import { Loader } from '@/components/ui/Loader';
import { useProductCategoryContext } from '@/contexts/ProductCategoryContext';
import { useProductsByCategory } from '@/hooks/data/Product';
import { useRenderGuard } from '@/hooks/useRenderGuard';

import { ThemedYStack } from '@/components/ui';
import React from 'react';
import { ProductList } from '../product/list/ProductList';

export const ProductCategoryProducts = () => {
    useRenderGuard('ProductCategoryProducts');
    const { productCategory } = useProductCategoryContext();
    const { items: products = [], isLoading, fetchNextPage, isFetchingNextPage, hasNextPage, total } = useProductsByCategory(productCategory);


    return (
        <ThemedYStack f={1} mih={0}>
            {isLoading ? (
                <Loader />
            ) : (
                <ProductList
                    transitionKey={productCategory.id}
                    products={products}
                    loadMore={fetchNextPage}
                    isLoadingMore={isFetchingNextPage}
                    hasMore={hasNextPage}
                    totalProducts={total}
                />
            )}
        </ThemedYStack>
    );
};


