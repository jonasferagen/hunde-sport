import { ThemedXStack } from '@/components/ui';
import { Loader } from '@/components/ui/Loader';
import { THEME_PRODUCT_ITEM_1, THEME_PRODUCT_ITEM_2 } from '@/config/app';
import { useVisibleItems } from '@/hooks/ui/useVisibleItems';
import { Product, PurchasableProduct } from '@/types';
import { FlashList, FlashListRef } from '@shopify/flash-list';
import React from 'react';
import { useWindowDimensions } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { ProductCard } from '../display/ProductCard';
import { BottomMoreHint, BottomMoreHintHandle } from './BottomMoreHint';


interface ProductListProps {
    products: Product[];
    loadMore: () => void;
    isLoadingMore: boolean;
    hasMore: boolean;
    /** Changes when the data identity changes (e.g. category id or search query) */
    transitionKey: string | number;
    totalProducts: number;
}

export const ProductList = React.memo(function ProductList({
    products,
    loadMore,
    isLoadingMore,
    hasMore,
    transitionKey,
    totalProducts,
}: ProductListProps) {
    const { width, height } = useWindowDimensions();
    const ITEM_HEIGHT = 170;

    const keyExtractor = React.useCallback((p: PurchasableProduct) => String(p.id), []);

    const onEndReached = React.useCallback(() => {
        if (hasMore && !isLoadingMore) loadMore();
    }, [hasMore, isLoadingMore, loadMore]);


    const { state: vis, onViewableItemsChanged, viewabilityConfig } = useVisibleItems();
    const hintRef = React.useRef<BottomMoreHintHandle>(null);
    const enabled = products.length < totalProducts;
    const shown = Math.min((vis.last >= 0 ? vis.last + 1 : 0), totalProducts);

    const onScroll = React.useCallback(() => {
        hintRef.current?.kick();
    }, []);

    const renderItem = React.useCallback(
        ({ item: product, index }: { item: PurchasableProduct; index: number }) => {

            return (
                <ProductCard
                    product={product}
                    theme={index % 2 === 0 ? THEME_PRODUCT_ITEM_1 : THEME_PRODUCT_ITEM_2}
                />)
        },
        []
    );

    const listRef = React.useRef<FlashListRef<PurchasableProduct>>(null);

    // whenever the screen/category changes (i.e., before the fade)
    React.useEffect(() => {
        listRef.current?.prepareForLayoutAnimationRender();
    }, [transitionKey]);

    return (
        <Animated.View
            key={transitionKey}
            collapsable={false}
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(300)}
            style={{ flex: 1 }}
        >
            <ThemedXStack f={1} mih={0} pos="relative">
                <FlashList
                    ref={listRef}
                    data={products as PurchasableProduct[]}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                    onEndReached={onEndReached}
                    onEndReachedThreshold={0.8}
                    ListFooterComponent={isLoadingMore ? <Loader w="100%" h={ITEM_HEIGHT} /> : null}
                    drawDistance={800}
                    getItemType={() => 'product'}
                    removeClippedSubviews={false}
                    onViewableItemsChanged={onViewableItemsChanged}
                    viewabilityConfig={viewabilityConfig}
                    onScroll={onScroll}
                    scrollEventThrottle={32}
                    showsVerticalScrollIndicator={false}

                />
                <BottomMoreHint
                    ref={hintRef}
                    enabled={enabled}
                    shown={shown}
                    total={totalProducts}
                />
            </ThemedXStack>
        </Animated.View>
    );
});

