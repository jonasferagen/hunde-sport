import { InfiniteListQueryResult } from '@/hooks/data/util';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import React, { JSX, useState } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { View } from 'tamagui';
import { LinearGradient } from 'tamagui/linear-gradient';


interface ScrollIndicatorProps {
    side: 'left' | 'right';
    width: string;
}

const ScrollIndicator = ({ side, width }: ScrollIndicatorProps) => {

    const gradientStart = side === 'left' ? [1, 0] : [0, 0];
    const gradientEnd = side === 'left' ? [0, 0] : [1, 0];



    return (
        <View
            pos="absolute"
            l={side === 'left' ? 0 : undefined}
            r={side === 'right' ? 0 : undefined}
            t={0}
            b={0}
            w={width}
            flex={1}
            ai="center"
            jc="flex-end"
            pe="none"
        >

            <LinearGradient
                colors={['$backgroundTransparent', '$background']}
                start={gradientStart as [number, number]}
                end={gradientEnd as [number, number]}
                pos="absolute"
                l={0}
                r={0}
                t={0}
                b={0}
            />

        </View>
    );
};

interface HorizontalTilesProps<T> {
    queryResult?: InfiniteListQueryResult<T>;
    items?: T[];
    renderItem: ListRenderItem<T>;
}


export const HorizontalTiles = <T extends { id: number | string }>({
    queryResult,
    items,
    renderItem,
}: HorizontalTilesProps<T>): JSX.Element => {

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
                onEndReachedThreshold={0.5}
                ListHeaderComponent={<View w={SPACING} h="100%" />}
                ListFooterComponent={<View w={SPACING} h="100%" />}
            />
            {isScrollable && !isAtEnd && <ScrollIndicator side="right" width="$6" />}
            {isScrollable && !isAtStart && <ScrollIndicator side="left" width="$6" />}
        </View>
    );
};
