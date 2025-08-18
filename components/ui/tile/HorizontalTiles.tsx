// HorizontalTiles.tsx
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import React, { JSX, useCallback, useMemo, useRef, useState } from 'react';
import { Dimensions, NativeScrollEvent, NativeSyntheticEvent, StyleSheet } from 'react-native';
import { Spinner, StackProps, Theme, View, XStack, getVariableValue, useTheme } from 'tamagui';
import { ThemedLinearGradient } from '../themed-components';

// ---- constants (avoid re-allocations) ----
const GAP_TOKEN = '$3';
const INDICATOR_WIDTH = '$6';
const SCREEN_W = Dimensions.get('window').width;

// Stable separator component
const Separator = React.memo(() => <View style={{ width: 12 }} />); // tweak to match GAP_TOKEN px

// ---- Indicators ----
const ScrollIndicator = React.memo(function ScrollIndicator({
    side,
    width,
}: { side: 'left' | 'right'; width: string }) {
    const theme = useTheme();
    const bg = getVariableValue(theme.background) as string;

    // memoize the color array so we don't rebuild every render
    const colors = useMemo<[string, string]>(() => {
        // avoid 'polished' per-render; use transparent via rgba string
        const transparent = bg.replace('rgb', 'rgba').replace(')', ',0)');
        return side === 'left'
            ? [transparent, bg]
            : [bg, transparent];
    }, [bg, side]);

    const start: [number, number] = side === 'left' ? [1, 0] : [0, 0];
    const end: [number, number] = side === 'left' ? [0, 0] : [1, 0];

    return (
        <XStack
            position="absolute"
            left={side === 'left' ? 0 : undefined}
            right={side === 'right' ? 0 : undefined}
            width={width}
            height="100%"
            pointerEvents="none"
        >
            <ThemedLinearGradient colors={colors} start={start} end={end} />
        </XStack>
    );
});

interface HorizontalTilesProps<T> extends StackProps {
    items?: T[];
    renderItem: ListRenderItem<T>;
    isLoading?: boolean;
    fetchNextPage?: () => void;
    hasNextPage?: boolean;
    // Optional size hints for FlashList (recommended)
    estimatedItemSize?: number;      // main axis size (width for horizontal)
    estimatedItemCrossSize?: number; // height
}

export function HorizontalTiles<T extends { id: number | string }>({
    items,
    renderItem,
    isLoading,
    fetchNextPage,
    hasNextPage,
    estimatedItemSize = 160,       // match PRODUCT_TILE_WIDTH
    estimatedItemCrossSize = 120,  // match PRODUCT_TILE_HEIGHT
    theme,                          // from StackProps
    ...props
}: HorizontalTilesProps<T>): JSX.Element {
    // only track whether we’re at edges; don’t set state every frame
    const [atStart, setAtStart] = useState(true);
    const [atEnd, setAtEnd] = useState(false);
    const contentWRef = useRef(0);
    const containerWRef = useRef(0);
    const lastStartRef = useRef(true);
    const lastEndRef = useRef(false);

    const onContentSizeChange = useCallback((w: number /*, h: number*/) => {
        contentWRef.current = w;
        // recompute edges
        const end = containerWRef.current + 0 >= w - 10;
        if (end !== lastEndRef.current) {
            lastEndRef.current = end;
            setAtEnd(end);
        }
    }, []);

    const onLayout = useCallback((e: any) => {
        const w = e.nativeEvent.layout.width;
        containerWRef.current = w;
    }, []);

    const onScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const x = e.nativeEvent.contentOffset.x;
        const start = x <= 10;
        const end = x + containerWRef.current >= contentWRef.current - 10;

        if (start !== lastStartRef.current) {
            lastStartRef.current = start;
            setAtStart(start);
        }
        if (end !== lastEndRef.current) {
            lastEndRef.current = end;
            setAtEnd(end);
        }
    }, []);

    const onEndReached = useCallback(() => {
        if (!isLoading && hasNextPage && fetchNextPage) fetchNextPage();
    }, [isLoading, hasNextPage, fetchNextPage]);

    if (!items?.length) return <></>;

    // render once; Theme at list level (if you need it) is fine
    return (
        <Theme name={theme}>
            <View style={styles.container} onLayout={onLayout} {...props}>
                <FlashList
                    horizontal
                    data={items}
                    renderItem={renderItem}
                    keyExtractor={(item) => String(item.id)}
                    showsHorizontalScrollIndicator={false}
                    ItemSeparatorComponent={Separator}
                    // sizing hints so FlashList skips measuring
                    estimatedItemSize={estimatedItemSize}
                    estimatedListSize={{ width: SCREEN_W, height: estimatedItemCrossSize }}
                    overrideItemLayout={(layout /*, _item, _index*/) => {
                        layout.size = estimatedItemSize; // width for horizontal
                        layout.span = 1;
                    }}
                    // smaller window avoids extra work
                    drawDistance={Math.ceil(SCREEN_W * 1.5)}
                    // reduce state churn from scrolling
                    onScroll={onScroll}
                    scrollEventThrottle={32}
                    // pagination
                    onContentSizeChange={onContentSizeChange}
                    onEndReached={onEndReached}
                    onEndReachedThreshold={0.5}
                    // spacing: use padding instead of a spacer Stack if you prefer
                    contentContainerStyle={styles.content}
                    ListFooterComponent={
                        hasNextPage && isLoading ? (
                            <View style={styles.footer}>
                                <Spinner />
                            </View>
                        ) : <View style={{ width: 12 }} />
                    }
                />

                {/* edge fades without per-frame re-render */}
                {!atEnd && <ScrollIndicator side="right" width={INDICATOR_WIDTH} />}
                {!atStart && <ScrollIndicator side="left" width={INDICATOR_WIDTH} />}
            </View>
        </Theme>
    );
}

const styles = StyleSheet.create({
    container: { position: 'relative' },
    content: { paddingHorizontal: 12 },
    footer: { width: 40, alignItems: 'center', justifyContent: 'center', marginLeft: 12 },
});
