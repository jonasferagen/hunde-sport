import { ThemedSpinner } from '@/components/ui/ThemedSpinner';
import { InfiniteListQueryResult } from '@/hooks/data/util';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { ChevronLeft, ChevronRight } from '@tamagui/lucide-icons';
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
    const [scrollOffset, setScrollOffset] = useState(0);
    const [contentWidth, setContentWidth] = useState(0);
    const [containerWidth, setContainerWidth] = useState(0);

    const isScrollable = contentWidth > containerWidth;
    const isAtStart = scrollOffset <= 10;
    const isAtEnd = scrollOffset + containerWidth >= contentWidth - 10;

    if (!items || items.length === 0) {
        return <></>;
    }

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        setScrollOffset(event.nativeEvent.contentOffset.x);
    };

    const SPACING = "$3";


    return (
        <View position="relative">
            <FlashList
                horizontal
                data={items}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={() => <View w={SPACING} />}
                estimatedItemSize={100}
                onScroll={handleScroll}
                scrollEventThrottle={16} // Trigger onScroll every 16ms
                onContentSizeChange={setContentWidth}
                onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
                onEndReached={() => {
                    if (fetchNextPage) {
                        fetchNextPage();
                    }
                }}
                onEndReachedThreshold={0.5}
                ListHeaderComponent={<View w={SPACING} />}
                ListFooterComponent={<View w={SPACING} flex={1} ai="center" jc="center">{isFetchingNextPage && <ThemedSpinner />}</View>}
            />
            {isScrollable && !isAtEnd && (
                <View
                    position="absolute"
                    right={0}
                    top={0}
                    bottom={0}
                    width={SPACING}
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
                    <ChevronRight color="$color" size="$4" />
                </View>
            )}
            {isScrollable && !isAtStart && (
                <View
                    position="absolute"
                    left={0}
                    top={0}
                    bottom={0}
                    width={SPACING}
                    ai="center"
                    jc="center"
                    pe="none"
                >
                    <LinearGradient
                        colors={['$backgroundTransparent', '$background']}
                        start={[1, 0]}
                        end={[0, 0]}
                        style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
                    />

                    <ChevronLeft color="$color" size="$4" />

                </View>
            )}
        </View>
    );
};
