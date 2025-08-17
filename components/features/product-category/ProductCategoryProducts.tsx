import { useProductCategoryContext } from '@/contexts/ProductCategoryContext';
import { useProductsByCategory } from '@/hooks/data/Product';
import { useRenderGuard } from '@/hooks/useRenderGuard';
import { LoadingScreen } from '@/screens/misc/LoadingScreen';

import React, { JSX } from 'react';
import { ProductList } from '../product/list/ProductList';

export const ProductCategoryProducts = (): JSX.Element => {
    useRenderGuard('ProductCategoryProducts');
    const { productCategory } = useProductCategoryContext();

    const { items: products, isLoading, fetchNextPage, isFetchingNextPage } = useProductsByCategory(productCategory!);

    if (isLoading) {
        return <LoadingScreen />;
    }

    return <ProductList
        products={products}
        loadingMore={isFetchingNextPage}
        loadMore={fetchNextPage}
    />;
};

