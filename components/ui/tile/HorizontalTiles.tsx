import { Product } from '@/types';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { rgba } from 'polished';
import React, { JSX, useCallback, useState } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { Spinner, View, XStack, getVariableValue, useTheme } from 'tamagui';
import { ThemedLinearGradient, ThemedYStack } from '../themed-components';

interface ScrollIndicatorProps {
    side: 'left' | 'right';
    width: string;
}

const ScrollIndicator = React.memo(({ side, width }: ScrollIndicatorProps) => {

    const gradientStart = side === 'left' ? [1, 0] : [0, 0];
    const gradientEnd = side === 'left' ? [0, 0] : [1, 0];

    const theme = useTheme()
    const backgroundColor = (getVariableValue(theme.background) as string)
    const backgroundTransparent = rgba(backgroundColor, 0);

    return (
        <XStack
            pos="absolute"
            l={side === 'left' ? 0 : undefined}
            r={side === 'right' ? 0 : undefined}
            w={width}
            f={1}
            ai="center"
            jc="flex-end"
            pe="none"
        >
            <ThemedLinearGradient
                colors={[backgroundTransparent, backgroundColor]}
                start={gradientStart as [number, number]}
                end={gradientEnd as [number, number]}
            />
        </XStack>
    );
});

interface HorizontalTilesProps<T> {
    items?: T[];
    renderItem: ListRenderItem<T>;
    isLoading?: boolean;
    fetchNextPage?: () => void;
    hasNextPage?: boolean;
}

export const HorizontalTiles = <T extends Product>({
    items,
    renderItem,
    isLoading,
    fetchNextPage,
    hasNextPage,
}: HorizontalTilesProps<T>): JSX.Element => {

    const [scrollOffset, setScrollOffset] = useState(0);
    const [contentWidth, setContentWidth] = useState(0);
    const [containerWidth, setContainerWidth] = useState(0);

    const isScrollable = contentWidth > containerWidth;
    const isAtStart = scrollOffset <= 10;
    const isAtEnd = scrollOffset + containerWidth >= contentWidth - 10;

    const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
        setScrollOffset(event.nativeEvent.contentOffset.x);
    }, []);

    const handleEndReached = useCallback(() => {
        if (!isLoading && hasNextPage && fetchNextPage) {
            fetchNextPage();
        }
    }, [isLoading, hasNextPage, fetchNextPage]);

    const SPACING = "$3";

    const renderFooter = useCallback(() => {
        if (!hasNextPage || !isLoading) return <View w={SPACING} h="100%" />;

        return (
            <View f={1} w="$10" ai="center" jc="center" ml={SPACING}>
                <Spinner />
            </View>
        );
    }, [hasNextPage, isLoading]);

    if (!items || items.length === 0) {
        return <></>;
    }

    return (
        <View position="relative">
            <FlashList
                horizontal
                data={items}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={() => <ThemedYStack ml="$3" />}
                estimatedItemSize={100}
                onScroll={handleScroll}
                scrollEventThrottle={16} // Trigger onScroll every 16ms
                onContentSizeChange={setContentWidth}
                onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
                onEndReached={handleEndReached}
                onEndReachedThreshold={0.5}
                ListFooterComponent={renderFooter}
            />
            {isScrollable && !isAtEnd && <ScrollIndicator side="right" width="$6" />}
            {isScrollable && !isAtStart && <ScrollIndicator side="left" width="$6" />}
        </View>
    );
};
