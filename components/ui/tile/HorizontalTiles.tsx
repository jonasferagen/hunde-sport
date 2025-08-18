// HorizontalTiles.tsx
import { QueryResult } from '@/hooks/data/util';
import { spacePx } from '@/lib/helpers';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { rgba } from 'polished';
import React, { JSX, useCallback, useMemo, useRef, useState } from 'react';
import { Dimensions, NativeScrollEvent, NativeSyntheticEvent, StyleSheet } from 'react-native';
import { Spinner, StackProps, View, XStack, getVariableValue, useTheme } from 'tamagui';
import { ThemedLinearGradient } from '../themed-components';

const SCREEN_W = Dimensions.get('window').width;

type SpaceToken = `$${number}`; // simple token type; adjust if you have Tamagui's SpaceTokens

// ---- Indicators ----
const ScrollIndicator = React.memo(function ScrollIndicator({
    side,
    widthToken,
}: { side: 'left' | 'right'; widthToken: SpaceToken }) {
    const theme = useTheme();
    const bg = String(getVariableValue(theme.background));

    const colors = useMemo<[string, string]>(() => {
        const transparent = rgba(bg, 0);
        const solid = rgba(bg, 1);
        return side === 'left' ? [transparent, solid] : [solid, transparent];
    }, [bg, side]);

    const start: [number, number] = [1, 0];
    const end: [number, number] = [0, 0];

    return (
        <XStack
            position="absolute"
            left={side === 'left' ? 0 : undefined}
            right={side === 'right' ? 0 : undefined}
            width={widthToken}         // token (e.g. "$6")
            height="100%"
            pointerEvents="none"
        >
            <ThemedLinearGradient colors={colors} start={start} end={end} />
        </XStack>
    );
});

interface HorizontalTilesProps<T> extends StackProps {

    renderItem: ListRenderItem<T>;
    queryResult: QueryResult<T>;
    limit: number,

    // FlashList hints
    estimatedItemSize?: number;      // main axis (width, horizontal)
    estimatedItemCrossSize?: number; // cross axis (height)

    // Tokenized spacing controls
    gapToken?: SpaceToken;           // space between tiles (default "$3")
    padToken?: SpaceToken;           // trailing padding right (default "$3")
    leadingInsetToken?: SpaceToken;  // extra left inset before first tile (default = padToken)
    indicatorWidthToken?: SpaceToken;// width of edge fades (default "$6")
}

export function HorizontalTiles<T extends { id: number | string }>({

    renderItem,
    queryResult,
    limit,

    estimatedItemSize = 160,
    estimatedItemCrossSize = 120,

    gapToken = '$3',
    padToken = '$3',
    leadingInsetToken,
    indicatorWidthToken = '$6',

    theme,
    ...props
}: HorizontalTilesProps<T>): JSX.Element {
    const leadPx = spacePx(leadingInsetToken ?? padToken); // how far the first item starts from the left
    const padPx = spacePx(padToken);
    const gapPx = spacePx(gapToken);
    const [atStart, setAtStart] = useState(true);
    const [atEnd, setAtEnd] = useState(false);
    const contentWRef = useRef(0);
    const containerWRef = useRef(0);
    const lastStartRef = useRef(true);
    const lastEndRef = useRef(false);

    const onContentSizeChange = useCallback((w: number) => {
        contentWRef.current = w;
        const end = containerWRef.current >= w - 10;
        if (end !== lastEndRef.current) {
            lastEndRef.current = end;
            setAtEnd(end);
        }
    }, []);

    const onLayout = useCallback((e: any) => {
        containerWRef.current = e.nativeEvent.layout.width;
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

    const { items: products = [], isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } = queryResult;

    const staged = products;
    //const staged = products.slice(0, limit);
    // const     items = (queryResult.items ?? []).slice(0, limit); // e.g., 8

    //  const staged = useProgressiveSlice(itemsToRender, limit, itemsToRender.length - limit, 120);

    const onEndReached = useCallback(() => {
        //if (!isLoading && !isFetchingNextPage && hasNextPage) fetchNextPage(); // Disable loading more for now
    }, [isFetchingNextPage, hasNextPage, fetchNextPage]);



    // Stable separator using the computed gap
    const ItemSeparatorComponent = useMemo(
        () => React.memo(() => <View style={{ width: gapPx }} />),
        [gapPx]
    );

    // Content padding: bigger left inset (leadPx), normal right pad (padPx)
    const contentStyle = useMemo(
        () => ({ paddingLeft: leadPx, paddingRight: padPx }),
        [leadPx, padPx]
    );

    if (!staged.length) return <></>;

    return (

        <View
            style={[styles.container, { height: estimatedItemCrossSize }]}
            onLayout={onLayout}
            mih={estimatedItemCrossSize}
            h={estimatedItemCrossSize}
            {...props}
        >
            <FlashList
                horizontal
                onScroll={onScroll}
                scrollEventThrottle={32}
                data={staged}
                renderItem={renderItem}
                keyExtractor={(p) => String(p.id)}
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={ItemSeparatorComponent}
                // sizing hints
                estimatedItemSize={estimatedItemSize}
                estimatedListSize={{ width: SCREEN_W, height: estimatedItemCrossSize }}
                overrideItemLayout={(layout) => { layout.size = estimatedItemSize; layout.span = 1; }}
                drawDistance={leadPx + estimatedItemSize * 2}
                getItemType={() => 'product'}
                // ~80% screen overscan

                onContentSizeChange={onContentSizeChange}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.5}
                contentContainerStyle={contentStyle}
                ListFooterComponent={
                    hasNextPage && isLoading ? (
                        <View style={[styles.footer, { marginLeft: gapPx }]}>
                            <Spinner />
                        </View>
                    ) : (
                        <View style={{ width: padPx }} /> // match trailing padding
                    )
                }

            />

            {/* Edge fades sized by token */}
            {!atEnd && <ScrollIndicator side="right" widthToken={indicatorWidthToken} />}
            {!atStart && <ScrollIndicator side="left" widthToken={indicatorWidthToken} />}
        </View>

    );
}

const styles = StyleSheet.create({
    container: { position: 'relative' },
    footer: { width: 40, alignItems: 'center', justifyContent: 'center' },
});
