import { Loader, ProductTile } from '@/components/ui';
import { useProducts } from '@/hooks/Product';
import React, { JSX } from 'react';
import { XStack } from 'tamagui';
import { ThemeVariant } from '../../ui/tile/BaseTile';

interface ProductTilesProps {
    ids: number[];
    themeVariant?: ThemeVariant;
}

export const ProductTiles2 = ({ ids, themeVariant = 'primary' }: ProductTilesProps): JSX.Element => {
    const { products, isLoading } = useProducts(ids);

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
