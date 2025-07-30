import { ThemedSpinner } from '@/components/ui/ThemedSpinner';
import { InfiniteListQueryResult } from '@/hooks/data/util';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { ChevronRight } from '@tamagui/lucide-icons';
import React, { JSX, useState } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { View } from 'tamagui';
import { LinearGradient } from 'tamagui/linear-gradient';

interface HorizontalTilesProps<T> {
    queryResult: InfiniteListQueryResult<T>;
    renderItem: ListRenderItem<T>;
}

export const HorizontalTiles = <T extends { id: number | string }>({
    queryResult,
    renderItem,
}: HorizontalTilesProps<T>): JSX.Element => {
    const { items, isFetchingNextPage, fetchNextPage } = queryResult;
    const [showIndicator, setShowIndicator] = useState(true);
    const [contentWidth, setContentWidth] = useState(0);
    const [containerWidth, setContainerWidth] = useState(0);

    const isScrollable = contentWidth > containerWidth;

    if (!items || items.length === 0) {
        return <></>;
    }

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        if (showIndicator && event.nativeEvent.contentOffset.x > 10) {
            setShowIndicator(false);
        }
    };

    return (
        <View position="relative">
            <FlashList
                horizontal
                data={items}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={() => <View width="$2" />}
                estimatedItemSize={100}
                onScroll={handleScroll}
                onContentSizeChange={(width) => {
                    setContentWidth(width);
                }}
                onLayout={(e) => {
                    setContainerWidth(e.nativeEvent.layout.width);
                }}
                onEndReached={() => {
                    if (fetchNextPage) {
                        fetchNextPage();
                    }
                }}
                onEndReachedThreshold={0.5}
                ListFooterComponent={isFetchingNextPage ? <ThemedSpinner /> : null}
            />
            {isScrollable && showIndicator && (
                <View
                    position="absolute"
                    right={0}
                    top={0}
                    bottom={0}
                    width={50}
                    ai="center"
                    jc="center"
                    pe="none"
                >
                    <LinearGradient
                        colors={['$backgroundTransparent', '$background']}
                        start={[0, 0]}
                        end={[1, 0]}
                        style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
                    />
                    <ChevronRight color="$color" size="$2" />
                </View>
            )}
        </View>
    );
};
