import { useProductsByCategory } from '@/hooks/data/Product';
import { useRenderGuard } from '@/hooks/useRenderGuard';
import { Category } from '@/models/Category';
import { LoadingScreen } from '@/screens/misc/LoadingScreen';
import React, { JSX } from 'react';
import { ProductList } from '../product/ProductList';

interface CategoryProductsProps {
    category: Category;
}

export const CategoryProducts = ({ category }: CategoryProductsProps): JSX.Element => {
    useRenderGuard('CategoryProducts');
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


    return <ProductList products={products} categoryId={category.id} loadingMore={isFetchingNextPage} loadMore={fetchNextPage} />;
};
