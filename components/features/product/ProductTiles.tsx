import { Loader } from '@/components/ui';
import { useProducts } from '@/hooks/Product';
import { ProductListType } from '@/hooks/Product/api';
import React, { JSX } from 'react';
import { ProductTile } from './ProductTile';

interface ProductTilesProps {
    type: ProductListType;
}

export const ProductTiles = ({ type }: ProductTilesProps): JSX.Element => {
    const { products, isLoading } = useProducts({ type });

    if (isLoading) {
        return <Loader />;
    }

    if (!products || products.length === 0) {
        return <></>;
    }

    return (
        <>
            {products.map((product) => (
                <ProductTile
                    key={product.id}
                    product={product}
                    themeVariant={'secondary'}
                />
            ))}
        </>
    );
};
