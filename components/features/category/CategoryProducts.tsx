import { Loader } from '@/components/ui';
import { useProductsByCategory } from '@/hooks/Product';
import { Category } from '@/types';
import React, { JSX } from 'react';
import { ProductList } from '../product/ProductList';

interface CategoryProductsProps {
    category: Category;
}

export const CategoryProducts = ({ category }: CategoryProductsProps): JSX.Element => {
    const { products, isLoading, isFetchingNextPage, fetchNextPage } = useProductsByCategory(category.id);

    if (isLoading) {
        return <Loader size="large" flex />;
    }

    if (!products || products.length === 0) {
        return <></>;
    }

    return <ProductList products={products} loadingMore={isFetchingNextPage} loadMore={fetchNextPage} />;
};
