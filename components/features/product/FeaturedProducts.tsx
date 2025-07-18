import { Loader } from '@/components/ui';
import { useFeaturedProducts } from '@/hooks/Product';
import React, { JSX } from 'react';
import { ProductCard } from './ProductCard';

export const FeaturedProducts = (): JSX.Element => {
    const { products, isLoading } = useFeaturedProducts();

    if (isLoading) {
        return <Loader />;
    }

    if (!products || products.length === 0) {
        return <></>;
    }

    return (
        <>
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </>
    );
};