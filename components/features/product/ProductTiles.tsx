import { Loader } from '@/components/ui';
import { ProductTile } from '@/components/ui/tile/ProductTile';
import { ThemeVariant } from '@/components/ui/tile/Tile';
import { InfiniteListQueryResult } from '@/hooks/data/util';
import { Product } from '@/models/Product';
import { SPACING } from '@/styles/Dimensions';
import { FlashList } from '@shopify/flash-list';
import React, { JSX } from 'react';
import { View } from 'react-native';

interface ProductTilesProps {
    queryResult: InfiniteListQueryResult<Product>;
    themeVariant?: ThemeVariant;
}

export const ProductTiles = ({ queryResult, themeVariant = 'primary' }: ProductTilesProps): JSX.Element => {
    const { items: products, isLoading, isFetchingNextPage, fetchNextPage } = queryResult;

    if (isLoading) {
        return <Loader size="large" flex />;
    }

    if (!products || products.length === 0) {
        return <></>;
    }

    return (
        <FlashList
            horizontal
            data={products}
            renderItem={({ item }) => (
                <ProductTile
                    product={item}
                    themeVariant={themeVariant}
                />
            )}
            keyExtractor={(item) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{ width: SPACING.md }} />}
            estimatedItemSize={150}
            onEndReached={() => {
                if (fetchNextPage) {
                    fetchNextPage();
                }
            }}
            onEndReachedThreshold={0.5}
            ListFooterComponent={isFetchingNextPage ? <Loader /> : null}
        />
    );
};
