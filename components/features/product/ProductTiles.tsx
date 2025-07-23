import { Loader } from '@/components/ui';
import { useProducts } from '@/hooks/Product';
import { ProductListType } from '@/hooks/Product/api';
import React, { JSX } from 'react';
import { XStack } from 'tamagui';
import { ThemeVariant } from '../../ui/tile/BaseTile';
import { ProductTile } from './ProductTile';

interface ProductTilesProps {
    type: ProductListType;
    params?: any;
    themeVariant?: ThemeVariant;
}

export const ProductTiles = ({ type, params, themeVariant = 'primary' }: ProductTilesProps): JSX.Element => {
    const { products, isLoading } = useProducts(type, params);

    if (isLoading) {
        return <Loader size="large" flex />;
    }

    if (!products || products.length === 0) {
        return <></>;
    }

    return (
        <XStack gap="$space.4">
            {products.map((product) => (
                <ProductTile
                    key={product.id}
                    product={product}
                    themeVariant={themeVariant}
                />
            ))}
        </XStack>
    );
};
