import { Loader } from '@/components/ui';
import { routes } from '@/config/routes';
import { InfiniteListQueryResult } from '@/hooks/data/util';
import { Product } from '@/models/Product';
import { CARD_DIMENSIONS } from '@/styles';
import React, { JSX } from 'react';
import { XStack } from 'tamagui';
import { ThemeVariant, Tile } from '../../ui/tile/Tile';

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
        <XStack gap="$space.4" minHeight={CARD_DIMENSIONS.product.height}>
            {
                products.map((product: Product) => (
                    <Tile
                        key={product.id}
                        title={product.name}
                        imageUrl={product.images?.[0]?.src ?? ''}
                        themeVariant={themeVariant}
                        width={CARD_DIMENSIONS.product.width}
                        height={CARD_DIMENSIONS.product.height}
                        titleNumberOfLines={2}
                        href={routes.product(product)}
                    />

                ))
            }
        </XStack >
    );
};
