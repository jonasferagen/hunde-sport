import { ProductTile } from '@/components/features/product/ProductTile';
import { Loader } from '@/components/ui';
import { ThemeVariant } from '@/components/ui/tile/Tile';
import { InfiniteListQueryResult } from '@/hooks/data/util';
import { Product } from '@/models/Product';
import React, { JSX } from 'react';
import { XStack } from 'tamagui';

interface ProductTilesProps {
    queryResult: InfiniteListQueryResult<Product>;
    themeVariant?: ThemeVariant;
}

export const ProductTiles = ({ queryResult, themeVariant = 'primary' }: ProductTilesProps): JSX.Element => {
    const { items: products, isLoading } = queryResult;

    if (isLoading) {
        return <Loader size="large" flex />;
    }

    if (!products || products.length === 0) {
        return <></>;
    }

    return (
        <XStack gap="$space.4" >
            {
                products.map((product: Product) => (
                    <ProductTile
                        key={product.id}
                        product={product}
                        themeVariant={themeVariant}
                    />
                ))
            }
        </XStack >
    );
};
