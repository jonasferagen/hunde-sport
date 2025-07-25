import { ProductTile } from '@/components/features/product/ProductTile';
import { InfiniteListQueryResult } from '@/hooks/data/util';
import { Product } from '@/models/Product';
import { ThemeVariant } from '@/types';
import React, { JSX } from 'react';
import { HorizontalTiles } from '../../ui/tile/HorizontalTiles';

interface ProductTilesProps {
    queryResult: InfiniteListQueryResult<Product>;
    theme?: ThemeVariant;
}

export const ProductTiles = ({ queryResult, theme = 'primary' }: ProductTilesProps): JSX.Element => {
    return (
        <HorizontalTiles
            queryResult={queryResult}
            renderItem={({ item }) => (
                <ProductTile
                    product={item}
                    theme={theme}
                />
            )}
        />
    );
};
