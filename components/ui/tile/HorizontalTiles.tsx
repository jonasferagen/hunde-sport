// HorizontalTiles.tsx
import { ProductPriceTag } from '@/components/features/product/display';
import { PRODUCT_TILE_HEIGHT, PRODUCT_TILE_WIDTH } from '@/config/app';
import { QueryResult } from '@/hooks/data/util';
import { useCanonicalNavigation } from '@/hooks/useCanonicalNavigation';
import { spacePx } from '@/lib/helpers';
import { PurchasableProduct } from '@/types';
import { FlashList, ViewToken } from '@shopify/flash-list';
import { rgba } from 'polished';
import React, { JSX, useCallback, useMemo, useRef, useState } from 'react';
import { Dimensions, NativeScrollEvent, NativeSyntheticEvent, StyleSheet } from 'react-native';
import { Spinner, StackProps, View, XStack } from 'tamagui';
import { ThemedLinearGradient } from '../themed-components';
import { TileBadge } from './TileBadge';
import { TileFixed } from './TileFixed';

const SCREEN_W = Dimensions.get('window').width;

type SpaceToken = `$${number}`; // simple token type; adjust if you have Tamagui's SpaceTokens

// ---- Indicators ----
const ScrollIndicator = React.memo(function ScrollIndicator({
    side,
    widthToken,
}: { side: 'left' | 'right'; widthToken: SpaceToken }) {
    const bg = '#fff';

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

export function HorizontalTiles({
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
}: HorizontalTilesProps<PurchasableProduct>): JSX.Element {
    const leadPx = spacePx(leadingInsetToken ?? padToken); // how far the first item starts from the left
    const padPx = spacePx(padToken);
    const gapPx = spacePx(gapToken);
    const [atStart, setAtStart] = useState(true);
    const [atEnd, setAtEnd] = useState(false);
    const contentWRef = useRef(0);
    const containerWRef = useRef(0);
    const lastStartRef = useRef(true);
    const lastEndRef = useRef(false);

    const { to } = useCanonicalNavigation();

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

    const { items, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } = queryResult;

    const products = items || [] as PurchasableProduct[];

    //const staged = products.slice(0, limit);
    // const     items = (queryResult.items ?? []).slice(0, limit); // e.g., 8

    //  const staged = useProgressiveSlice(itemsToRender, limit, itemsToRender.length - limit, 120);

    const onEndReached = useCallback(() => {
        if (!isLoading && !isFetchingNextPage && hasNextPage) fetchNextPage(); // Disable loading more for now
    }, [isFetchingNextPage, hasNextPage, fetchNextPage]);



    const [visible, setVisible] = React.useState<Set<number>>(new Set());

    const onViewableItemsChanged = React.useRef(
        ({ changed }: { changed: ViewToken[] }) => {
            // mutate a Set, then replace to update only when something actually changes
            setVisible(prev => {
                const next = new Set(prev);
                let dirty = false;
                for (const c of changed) {
                    if (c.index == null) continue;
                    if (c.isViewable) { if (!next.has(c.index)) { next.add(c.index); dirty = true; } }
                    else { if (next.delete(c.index)) dirty = true; }
                }
                return dirty ? next : prev;
            });
        }
    ).current;

    const viewabilityConfig = React.useMemo(
        () => ({ itemVisiblePercentThreshold: 50 }),
        []
    );

    if (!products.length) return <></>;

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
                data={products}
                keyExtractor={(p) => String(p.id)}
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={ItemSeparatorComponent}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}

                // Good UX for carousels:
                decelerationRate="fast"
                snapToAlignment="start"
                snapToInterval={estimatedItemSize + gapPx}      // if you want snapping
                disableIntervalMomentum
                // helps on Android when nested:
                nestedScrollEnabled

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
                renderItem={({
                    item: product,
                    index }: {
                        item: PurchasableProduct;
                        index: number
                    }) => (
                    <TileFixed
                        onPress={() => to('product', product)}
                        title={product.name}
                        image={product.featuredImage}
                        w={PRODUCT_TILE_WIDTH as number}
                        h={PRODUCT_TILE_HEIGHT as number}
                        // tiny micro-optic: higher priority for first 3 tiles
                        imagePriority={index < 3 ? 'high' : 'low'}
                        interactive={true || visible.has(index)}
                    >
                        <TileBadge pointerEvents="none">
                            <ProductPriceTag product={product} />
                        </TileBadge>
                    </TileFixed>
                )}
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
