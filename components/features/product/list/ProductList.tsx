import { ThemedXStack } from '@/components/ui';
import { ThemedSpinner } from '@/components/ui/themed-components/ThemedSpinner';
import { THEME_PRODUCT_ITEM_1, THEME_PRODUCT_ITEM_2 } from '@/config/app';
import { PurchasableProviderInit } from '@/contexts/PurchasableContext';
import { useEdgeFades } from '@/hooks/useEdgeFades';
import { Product, PurchasableProduct } from '@/types';
import { FlashList } from '@shopify/flash-list';
import React from 'react';
import { useWindowDimensions } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { ProductCard } from '../display/ProductCard';


interface ProductListProps {
    products: Product[];
    loadMore: () => void;
    isLoadingMore: boolean;
    hasMore: boolean;
    /** Changes when the data identity changes (e.g. category id or search query) */
    transitionKey: string | number;
}

export const ProductList = React.memo(function ProductList({
    products, loadMore, isLoadingMore, hasMore, transitionKey,
}: ProductListProps) {
    const { width, height } = useWindowDimensions();
    const ITEM_HEIGHT = 170;

    const keyExtractor = React.useCallback((p: PurchasableProduct) => String(p.id), []);
    const renderItem = React.useCallback(
        ({ item: product, index }: { item: PurchasableProduct; index: number }) => (
            <PurchasableProviderInit product={product}>
                <ProductCard theme={index % 2 === 0 ? THEME_PRODUCT_ITEM_1 : THEME_PRODUCT_ITEM_2} />
            </PurchasableProviderInit>
        ),
        []
    );

    const onEndReached = React.useCallback(() => {
        if (hasMore && !isLoadingMore) loadMore();
    }, [hasMore, isLoadingMore, loadMore]);

    const edges = useEdgeFades('vertical');

    return (
        <Animated.View
            key={transitionKey}
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(300)}
            style={{ flex: 1 }}
        >
            <ThemedXStack f={1} mih={0} pos="relative" onLayout={edges.onLayout}>
                <FlashList
                    // also resetting FlashList internals on identity change is OK:
                    key={transitionKey}
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
                />

            </ThemedXStack>
        </Animated.View>
    );
});
