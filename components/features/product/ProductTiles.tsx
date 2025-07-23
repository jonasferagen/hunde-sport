import { Loader } from '@/components/ui';
import React, { JSX } from 'react';
import { XStack } from 'tamagui';
import { ThemeVariant } from '../../ui/tile/BaseTile';
import { ProductTile } from './ProductTile';

interface ProductTilesProps {
    querybuilder: any;
    themeVariant?: ThemeVariant;
}

export const ProductTiles = ({ querybuilder, themeVariant = 'primary' }: ProductTilesProps): JSX.Element => {
    const { items: products, isLoading } = querybuilder;
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
