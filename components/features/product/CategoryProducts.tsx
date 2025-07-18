import { useProductsByCategory } from '@/hooks/Product';
import { Category } from '@/types';
import React, { JSX } from 'react';
import { ProductList } from './ProductList';

interface CategoryProductsProps {
    category: Category;
}

export const CategoryProducts = ({ category }: CategoryProductsProps): JSX.Element => {
    const { products, isFetchingNextPage, fetchNextPage } = useProductsByCategory(category.id);



    return <ProductList products={products} loadingMore={isFetchingNextPage} loadMore={fetchNextPage} />;
};
