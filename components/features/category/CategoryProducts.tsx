import { useCategoryContext } from '@/contexts/CategoryContext';
import { useProductsByCategory } from '@/hooks/data/Product';
import { useRenderGuard } from '@/hooks/useRenderGuard';
import { LoadingScreen } from '@/screens/misc/LoadingScreen';

import { Category } from '@/models/Category';
import React, { JSX } from 'react';
import { ProductList } from '../product/ProductList';

interface CategoryProductListProps {
    category: Category;
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


export const CategoryProducts = (): JSX.Element | null => {
    useRenderGuard('CategoryProducts');
    const { category } = useCategoryContext();

    if (!category) {
        return null; // Category is being loaded by the provider
    }

    return <CategoryProductList category={category} />;
};
