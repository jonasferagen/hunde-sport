import { useProductCategoryContext } from '@/contexts/ProductCategoryContext';
import { useProductsByCategory } from '@/hooks/data/Product';
import { useRenderGuard } from '@/hooks/useRenderGuard';
import { LoadingScreen } from '@/screens/misc/LoadingScreen';

import React, { JSX } from 'react';
import { useThemeName } from 'tamagui';
import { ProductList } from '../product/ProductList';

export const ProductCategoryProducts = (): JSX.Element | null => {
    useRenderGuard('ProductCategoryProducts');
    const { productCategory } = useProductCategoryContext();
    const { items: products, isLoading, fetchNextPage, isFetchingNextPage } = useProductsByCategory(productCategory!);

    const t = useThemeName();
    console.log(t);

    if (isLoading) {
        return <LoadingScreen />;
    }


    return <ProductList
        products={products}
        loadingMore={isFetchingNextPage}
        loadMore={fetchNextPage}
    />;

};

