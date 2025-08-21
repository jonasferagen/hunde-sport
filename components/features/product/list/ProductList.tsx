import { ThemedXStack } from '@/components/ui';
import { EdgeFadesOverlay } from '@/components/ui/list/EdgeFadesOverlay';
import { ThemedSpinner } from '@/components/ui/themed-components/ThemedSpinner';
import { THEME_PRODUCT_ITEM_1, THEME_PRODUCT_ITEM_2 } from '@/config/app';
import { PurchasableProviderInit } from '@/contexts/PurchasableContext';
import { useEdgeFades } from '@/hooks/useEdgeFades';
import { Product, PurchasableProduct } from '@/types';
import { FlashList } from '@shopify/flash-list';
import React from 'react';
import { useWindowDimensions } from 'react-native';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import { ProductCard } from '../display/ProductCard';

interface ProductListProps {
    products: Product[];
    loadMore: () => void;
    isLoadingMore: boolean;
    hasMore: boolean;
}
export const ProductList = React.memo(function ProductList({
    products, loadMore, isLoadingMore, hasMore,
}: ProductListProps) {
    const { width, height } = useWindowDimensions();
    const ITEM_HEIGHT = 170;

    const keyExtractor = React.useCallback((p: PurchasableProduct) => String(p.id), []);
    const renderItem = React.useCallback(
        ({ item: product, index }: { item: PurchasableProduct; index: number }) => (
            <Animated.View
                entering={FadeIn.duration(300)}
                exiting={FadeOut.duration(300)}
                layout={LinearTransition.duration(150)}
                collapsable={false}
                style={{ width: '100%' }}
            >
                <PurchasableProviderInit product={product}>
                    <ProductCard theme={index % 2 === 0 ? THEME_PRODUCT_ITEM_1 : THEME_PRODUCT_ITEM_2} />
                </PurchasableProviderInit>
            </Animated.View>
        ),
        []
    );

    const onEndReached = React.useCallback(() => {
        if (hasMore && !isLoadingMore) loadMore();
    }, [hasMore, isLoadingMore, loadMore]);

    const edges = useEdgeFades('vertical');

    return (


        <ThemedXStack f={1} mih={0} pos="relative" onLayout={edges.onLayout}>
            <Animated.View layout={LinearTransition.duration(500)}>
                <FlashList
                    data={products as PurchasableProduct[]}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                    onEndReached={onEndReached}
                    onEndReachedThreshold={0.8}
                    ListFooterComponent={isLoadingMore ? <ThemedSpinner my="$3" /> : null}
                    estimatedItemSize={ITEM_HEIGHT}
                    overrideItemLayout={(l) => { l.size = ITEM_HEIGHT; }}
                    estimatedListSize={{ width, height }}
                    drawDistance={800}
                    getItemType={() => 'product'}
                    removeClippedSubviews
                    onScroll={edges.onScroll}
                    scrollEventThrottle={32}
                    onContentSizeChange={edges.onContentSizeChange}
                    showsVerticalScrollIndicator={false}
                // Optional: add top/bottom padding as ListHeader/Footers if you want fades to consider them
                />
                <EdgeFadesOverlay
                    orientation="vertical"
                    visibleStart={edges.atStart}
                    visibleEnd={edges.atEnd}
                    heightToken="$1"   // fade thickness
                    bg="#888"
                />
            </Animated.View>
        </ThemedXStack>


    );
});
