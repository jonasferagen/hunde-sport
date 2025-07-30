import { ProductTile } from '@/components/features/product/ProductTile';
import { InfiniteListQueryResult } from '@/hooks/data/util';
import { Product } from '@/models/Product';
import React, { JSX } from 'react';
import { ThemeName } from 'tamagui';
import { HorizontalTiles } from '../../ui/tile/HorizontalTiles';

interface ProductTilesProps {
    queryResult: InfiniteListQueryResult<Product>;
    theme?: ThemeName;
}

export const ProductTiles = ({ queryResult, theme = 'primary' }: ProductTilesProps): JSX.Element => {

    return <HorizontalTiles
        queryResult={queryResult}
        renderItem={({ item }) => (
            <ProductTile
                product={item}
                theme={theme}
            />
        )}
    />

};
