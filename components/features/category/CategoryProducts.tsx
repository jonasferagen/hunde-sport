import { useProductCategoryContext } from '@/contexts/ProductCategoryContext';
import { useProductsByCategory } from '@/hooks/data/Product';
import { useRenderGuard } from '@/hooks/useRenderGuard';
import { LoadingScreen } from '@/screens/misc/LoadingScreen';

import { ProductCategory } from '@/models/Category';
import React, { JSX } from 'react';
import { ProductList } from '../product/ProductList';


export const CategoryProducts = (): JSX.Element | null => {
    useRenderGuard('CategoryProducts');
    const { productCategory: category } = useProductCategoryContext();

    if (!category) {
        return <LoadingScreen />;
    }

    return <CategoryProductList category={category} />;
};

interface CategoryProductListProps {
    category: ProductCategory;
}

const CategoryProductList = ({ category }: CategoryProductListProps): JSX.Element => {
    useRenderGuard('CategoryProductList');

    const { items: products,
        isLoading,
        isFetchingNextPage,
        fetchNextPage } = useProductsByCategory(
            category,
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
