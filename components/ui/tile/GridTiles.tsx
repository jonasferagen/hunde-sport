import { ThemedSpinner } from '@/components/ui/ThemedSpinner';
import { InfiniteListQueryResult } from '@/hooks/data/util';
import { CellContainer, FlashList, ListRenderItem } from '@shopify/flash-list';
import { CellContainerProps } from '@shopify/flash-list/dist/native/cell-container/CellContainer';
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

    if (isLoading) {
        return <ThemedSpinner size="large" />;
    }

    if (!items || items.length === 0) {
        return <></>;
    }
    const numRows = Math.ceil(items.length / numColumns);

    return (
        <FlashList

            numColumns={numColumns}
            CellRendererComponent={(props) => GridTileContainer({ props, numColumns, numRows })}
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

const GridTileContainer = ({ props, numColumns, numRows }: { props: CellContainerProps, numColumns: number, numRows: number }) => {
    const spacing = getTokens().space['$1'].val;

    const paddingLeft = props.index % numColumns === 0 ? 0 : spacing;   // First column
    const paddingRight = props.index % numColumns === numColumns - 1 ? 0 : spacing; // Last column
    const paddingTop = props.index < numColumns ? 0 : spacing; // First row
    const paddingBottom = props.index >= (numRows - 1) * numColumns ? 0 : spacing; // Last row


    return <CellContainer {...props} style={[props.style, { paddingLeft, paddingRight, paddingBottom, paddingTop }]} >{props.children}</CellContainer>;
}
