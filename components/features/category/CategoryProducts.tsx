import { Loader } from '@/components/ui';
import { useProductsByCategory } from '@/hooks/Product';
import { useRenderGuard } from '@/hooks/useRenderGuard';
import { Category } from '@/models/Category';
import React, { JSX } from 'react';
import { ProductList } from '../product/ProductList';

interface CategoryProductsProps {
    category: Category;
}

export const CategoryProducts = ({ category }: CategoryProductsProps): JSX.Element => {
    useRenderGuard('CategoryProducts');
    const { products, isLoading, isFetchingNextPage, fetchNextPage } = useProductsByCategory(category.id);

    if (isLoading) {
        return <Loader size="large" flex />;
    }

    if (!products || products.length === 0) {
        return <></>;
    }

    return <ProductList products={products} categoryId={category.id} loadingMore={isFetchingNextPage} loadMore={fetchNextPage} />;
};
