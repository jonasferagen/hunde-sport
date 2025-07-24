import { ProductTile } from '@/components/ui/tile/ProductTile';
import { InfiniteListQueryResult } from '@/hooks/data/util';
import { Product } from '@/models/Product';
import { ThemeVariant } from '@/types';
import { FlashList } from '@shopify/flash-list';
import React, { JSX } from 'react';
import { Spinner, View, YStack } from 'tamagui';

interface ProductTilesProps {
    queryResult: InfiniteListQueryResult<Product>;
    theme?: ThemeVariant;
}

export const ProductTiles = ({ queryResult, theme = 'primary' }: ProductTilesProps): JSX.Element => {
    const { items: products, isLoading, isFetchingNextPage, fetchNextPage } = queryResult;


    if (isLoading) {
        return <Spinner size="small" />;
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
                    theme={theme}
                />
            )}
            keyExtractor={(item) => item.id.toString()}
            showsHorizontalScrollIndicator={true}
            ItemSeparatorComponent={() => <View width="$4" />}
            estimatedItemSize={150}
            onEndReached={() => {
                if (fetchNextPage) {
                    fetchNextPage();
                }
            }}
            onEndReachedThreshold={0.5}
            ListFooterComponent={isFetchingNextPage ? <YStack flex={1} ai="center" jc="center"><Spinner size="small" /></YStack> : null}
        />
    );
};
