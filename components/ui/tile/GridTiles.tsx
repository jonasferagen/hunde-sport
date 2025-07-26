import { ThemedSpinner } from '@/components/ui/ThemedSpinner';
import { InfiniteListQueryResult } from '@/hooks/data/util';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import React, { JSX } from 'react';
import { getTokens } from 'tamagui';

interface GridTilesProps<T> {
    queryResult: InfiniteListQueryResult<T>;
    renderItem: ListRenderItem<T>;
    numColumns?: number;

}

export const GridTiles = <T extends { id: number | string }>({
    queryResult,
    renderItem,
    numColumns = 3,
}: GridTilesProps<T>): JSX.Element => {
    const { items, isLoading, isFetchingNextPage, fetchNextPage } = queryResult;
    const spacing = getTokens().space['$3'].val;


    if (isLoading) {
        return <ThemedSpinner size="large" />;
    }

    if (!items || items.length === 0) {
        return <></>;
    }

    return (
        <FlashList

            numColumns={numColumns}
            contentContainerStyle={{ padding: 0 }}
            data={items}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
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
