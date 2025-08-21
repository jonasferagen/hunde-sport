import { useProductCategoryContext } from '@/contexts/ProductCategoryContext';
import { useProductsByCategory } from '@/hooks/data/Product';
import { useRenderGuard } from '@/hooks/useRenderGuard';
import { LoadingScreen } from '@/screens/misc/LoadingScreen';

import { ThemedYStack } from '@/components/ui';
import React from 'react';
import { ProductList } from '../product/list/ProductList';

export const ProductCategoryProducts = () => {
    useRenderGuard('ProductCategoryProducts');
    const { productCategory } = useProductCategoryContext();
    const { items: products = [], isLoading, fetchNextPage, isFetchingNextPage, hasNextPage } = useProductsByCategory(productCategory);

    return (
        <ThemedYStack f={1} mih={0}>
            {isLoading ? (
                <LoadingScreen />
            ) : (

                <ProductList
                    transitionKey={productCategory.id}
                    products={products}
                    loadMore={fetchNextPage}
                    isLoadingMore={isFetchingNextPage}
                    hasMore={hasNextPage}
                />
            )}
        </ThemedYStack>
    );
};


