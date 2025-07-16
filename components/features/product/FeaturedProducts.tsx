import { Loader } from '@/components/ui';
import { useFeaturedProducts } from '@/hooks/Product';
import React from 'react';
import { ProductCard } from './ProductCard';

export const FeaturedProducts = () => {
    const { products, isLoading } = useFeaturedProducts();

    if (isLoading) {
        return <Loader />;
    }

    if (!products || products.length === 0) {
        return null;
    }

    return (
        products.map((product) => (
            <ProductCard key={product.id} product={product} />
        ))
    );
};