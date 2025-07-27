import { ThemedSpinner } from '@/components/ui/ThemedSpinner';
import { InfiniteListQueryResult } from '@/hooks/data/util';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import React, { JSX } from 'react';
import { View } from 'tamagui';

interface HorizontalTilesProps<T> {
    queryResult: InfiniteListQueryResult<T>;
    renderItem: ListRenderItem<T>;
}

export const HorizontalTiles = <T extends { id: number | string }>({
    queryResult,
    renderItem,
}: HorizontalTilesProps<T>): JSX.Element => {
    const { items, isLoading, isFetchingNextPage, fetchNextPage } = queryResult;


    if (isLoading) {
        //    return <ThemedSpinner size="small" />;
    }

    if (!items || items.length === 0) {
        return <></>;
    }

    return (
        <FlashList
            horizontal
            data={items}
            renderItem={renderItem}
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
            ListFooterComponent={isFetchingNextPage ? <ThemedSpinner flex={1} ai="center" jc="center" size="small" /> : null}
        />
    );
};
