// HorizontalTiles.tsx (refactor)
import { ProductPriceTag } from '@/components/features/product/display';
import type { QueryResult } from '@/hooks/data/util';
import { useCanonicalNavigation } from '@/hooks/useCanonicalNavigation';
import { spacePx } from '@/lib/helpers';
import type { PurchasableProduct } from '@/types';
import { FlashList, ViewToken } from '@shopify/flash-list';
import { rgba } from 'polished';
import React, { JSX } from 'react';
import { Dimensions, NativeScrollEvent, NativeSyntheticEvent, View as RNView, StyleSheet } from 'react-native';
import { SpaceTokens, StackProps, View, XStack } from 'tamagui';
import { ThemedLinearGradient } from '../themed-components';
import { TileBadge } from './TileBadge';
import { TileFixed } from './TileFixed';

const SCREEN_W = Dimensions.get('window').width;

// ---- Indicators ----
const ScrollIndicator = React.memo(function ScrollIndicator({
    side,
    widthToken,
}: { side: 'left' | 'right'; widthToken: SpaceTokens }) {
    const bg = '#fff';
    const colors = React.useMemo<[string, string]>(() => {
        const transparent = rgba(bg, 0);
        const solid = rgba(bg, 1);
        return side === 'left' ? [transparent, solid] : [solid, transparent];
    }, [bg, side]);

    return (
        <XStack
            position="absolute"
            left={side === 'left' ? 0 : undefined}
            right={side === 'right' ? 0 : undefined}
            width={widthToken}
            height="100%"
            pointerEvents="none"
        >
            <ThemedLinearGradient colors={colors} start={[1, 0]} end={[0, 0]} />
        </XStack>
    );
});

interface HorizontalTilesProps<T> extends StackProps {
    queryResult: QueryResult<T>;
    limit: number;

    estimatedItemSize?: number;      // item width
    estimatedItemCrossSize?: number; // item height

    gapToken?: SpaceTokens;
    padToken?: SpaceTokens;
    leadingInsetToken?: SpaceTokens;
    indicatorWidthToken?: SpaceTokens;
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
    const leadPx = spacePx((leadingInsetToken ?? padToken) as string);
    const padPx = spacePx(padToken as string);
    const gapPx = spacePx(gapToken as string);

    const [atStart, setAtStart] = React.useState(true);
    const [atEnd, setAtEnd] = React.useState(false);

    const contentWRef = React.useRef(0);
    const containerWRef = React.useRef(0);
    const lastStartRef = React.useRef(true);
    const lastEndRef = React.useRef(false);

    const { to } = useCanonicalNavigation();

    // ---- data (limit applied) ----
    const { items = [], isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } = queryResult;
    const products = React.useMemo(
        () => (items as PurchasableProduct[]).slice(0, limit),
        [items, limit]
    );
    if (products.length === 0) return <></>;

    // ---- size + edges ----
    const recomputeEdges = React.useCallback(() => {
        const start = true; // when x==0 (we set at scroll time)
        const end = containerWRef.current >= contentWRef.current - 1;
        if (end !== lastEndRef.current) {
            lastEndRef.current = end;
            setAtEnd(end);
        }
    }, []);

    const onLayout = React.useCallback((e: any) => {
        containerWRef.current = e.nativeEvent.layout.width;
        recomputeEdges();
    }, [recomputeEdges]);

    const onContentSizeChange = React.useCallback((w: number) => {
        contentWRef.current = w;
        recomputeEdges();
    }, [recomputeEdges]);

    const onScroll = React.useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const x = e.nativeEvent.contentOffset.x;
        const start = x <= 1;
        const end = x + containerWRef.current >= contentWRef.current - 1;
        if (start !== lastStartRef.current) { lastStartRef.current = start; setAtStart(start); }
        if (end !== lastEndRef.current) { lastEndRef.current = end; setAtEnd(end); }
    }, []);

    // ---- viewability (for image priority / interaction) ----
    const [visible, setVisible] = React.useState<Set<number>>(new Set());
    const onViewableItemsChanged = React.useRef(({ changed }: { changed: ViewToken[] }) => {
        setVisible(prev => {
            let dirty = false; const next = new Set(prev);
            for (const c of changed) {
                if (c.index == null) continue;
                if (c.isViewable) { if (!next.has(c.index)) { next.add(c.index); dirty = true; } }
                else { if (next.delete(c.index)) dirty = true; }
            }
            return dirty ? next : prev;
        });
    }).current;
    const viewabilityConfig = React.useMemo(() => ({ itemVisiblePercentThreshold: 50 }), []);

    // ---- rendering ----
    const HeaderSpacer = React.useMemo(
        () => () => <RNView style={{ width: leadPx }} />,
        [leadPx]
    );
    const Separator = React.useMemo(
        () => () => <RNView style={{ width: gapPx }} />,
        [gapPx]
    );
    const FooterSpacer = React.useMemo(
        () => () => <RNView style={{ width: padPx }} />,
        [padPx]
    );

    const onEndReached = React.useCallback(() => {
        if (!isLoading && !isFetchingNextPage && hasNextPage) fetchNextPage();
    }, [isLoading, isFetchingNextPage, hasNextPage, fetchNextPage]);

    // stable item
    const renderItem = React.useCallback(
        ({ item, index }: { item: PurchasableProduct; index: number }) => (
            <TileFixed
                onPress={() => to('product', item)}
                title={item.name}
                image={item.featuredImage}
                w={estimatedItemSize}
                h={estimatedItemCrossSize}
                imagePriority={index < 3 ? 'high' : 'low'}
                interactive={visible.has(index)}
            >
                <TileBadge pointerEvents="none">
                    <ProductPriceTag product={item} />
                </TileBadge>
            </TileFixed>
        ),
        [to, visible, estimatedItemSize, estimatedItemCrossSize]
    );

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
                data={products}
                keyExtractor={(p) => String(p.id)}
                renderItem={renderItem}
                ItemSeparatorComponent={Separator}
                ListHeaderComponent={HeaderSpacer}
                ListFooterComponent={FooterSpacer}
                showsHorizontalScrollIndicator={false}
                onScroll={onScroll}
                scrollEventThrottle={32}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}

                // UX: carousel feel
                decelerationRate="fast"
                snapToAlignment="start"
                snapToInterval={estimatedItemSize + gapPx}
                disableIntervalMomentum
                nestedScrollEnabled

                // sizing hints
                estimatedItemSize={estimatedItemSize}
                estimatedListSize={{ width: SCREEN_W, height: estimatedItemCrossSize }}
                overrideItemLayout={(layout) => { layout.size = estimatedItemSize; }} // (offset optional in your v1 types)

                // virtualization + paging
                drawDistance={leadPx + estimatedItemSize * 2}
                getItemType={() => 'product'}
                onContentSizeChange={onContentSizeChange}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.5}
            />

            {/* Edge fades */}
            {!atEnd && <ScrollIndicator side="right" widthToken={indicatorWidthToken} />}
            {!atStart && <ScrollIndicator side="left" widthToken={indicatorWidthToken} />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { position: 'relative' },
});
