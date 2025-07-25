import { useProductsByCategory } from '@/hooks/data/Product';
import { useRenderGuard } from '@/hooks/useRenderGuard';
import { Category } from '@/models/Category';
import React, { JSX } from 'react';
import { Spinner, YStack } from 'tamagui';
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
            category.id,
            { autoload: false }
        );

    if (isLoading) {
        return <YStack flex={1} ai="center" jc="center"><Spinner size="large" /></YStack>;
    }

    if (!products || products.length === 0) {
        return <></>;
    }

    return <ProductList products={products} categoryId={category.id} loadingMore={isFetchingNextPage} loadMore={fetchNextPage} />;
};
