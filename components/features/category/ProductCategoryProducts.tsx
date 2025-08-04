import { useProductCategoryContext } from '@/contexts/ProductCategoryContext';
import { useProductsByCategory } from '@/hooks/data/Product';
import { useRenderGuard } from '@/hooks/useRenderGuard';
import { LoadingScreen } from '@/screens/misc/LoadingScreen';

import { ProductCategory } from '@/models/ProductCategory';
import React, { JSX } from 'react';
import { ProductList } from '../product/ProductList';


export const ProductCategoryProducts = (): JSX.Element | null => {
    useRenderGuard('ProductCategoryProducts');
    const { productCategory } = useProductCategoryContext();

    if (!productCategory) {
        return <LoadingScreen />;
    }

    return <ProductCategoryProductList productCategory={productCategory} />;
};

interface ProductCategoryProductListProps {
    productCategory: ProductCategory;
}

const ProductCategoryProductList = ({ productCategory }: ProductCategoryProductListProps): JSX.Element => {
    useRenderGuard('ProductCategoryProductList');

    const { items: products,
        isLoading,
        isFetchingNextPage,
        fetchNextPage } = useProductsByCategory(
            productCategory,
            { autoload: false }
        );

    if (isLoading) {
        return <LoadingScreen />;
    }

    return <ProductList
        products={products}
        loadingMore={isFetchingNextPage}
        loadMore={fetchNextPage}
    />;
};
