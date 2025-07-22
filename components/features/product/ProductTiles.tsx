import { Loader } from '@/components/ui';
import { useProductsList } from '@/hooks/Product';
import { ProductListType } from '@/hooks/Product/api';
import React, { JSX } from 'react';
import { XStack } from 'tamagui';
import { ThemeVariant } from '../../ui/tile/BaseTile';
import { ProductTile } from './ProductTile';

interface ProductTilesProps {
    type: ProductListType;
    themeVariant?: ThemeVariant;
}

export const ProductTiles = ({ type, themeVariant = 'primary' }: ProductTilesProps): JSX.Element => {
    const { products, isLoading } = useProductsList(type);

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
