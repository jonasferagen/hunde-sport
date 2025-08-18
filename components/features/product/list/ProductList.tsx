import { ThemedSpinner } from '@/components/ui/themed-components/ThemedSpinner';
import { THEME_PRODUCT_ITEM_1, THEME_PRODUCT_ITEM_2 } from '@/config/app';
import { PurchasableProviderInit } from '@/contexts/PurchasableContext';
import { Product, PurchasableProduct } from '@/types';
import { FlashList } from '@shopify/flash-list';
import React from 'react';
import { useWindowDimensions } from 'react-native';
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
            <PurchasableProviderInit product={product}>
                <ProductCard theme={index % 2 === 0 ? THEME_PRODUCT_ITEM_1 : THEME_PRODUCT_ITEM_2} />
            </PurchasableProviderInit>
        ),
        []
    );

    const onEndReached = React.useCallback(() => {
        if (hasMore && !isLoadingMore) loadMore();
    }, [hasMore, isLoadingMore, loadMore]);


    return (


        <FlashList
            data={products as PurchasableProduct[]}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.8}
            ListFooterComponent={isLoadingMore ? <ThemedSpinner my="$3" /> : null}

            // sizing & virtualization
            style={{ flex: 1 }}                          // <- this fills because parents give height
            estimatedItemSize={ITEM_HEIGHT}
            overrideItemLayout={(l) => { l.size = ITEM_HEIGHT; }}
            estimatedListSize={{ width, height }}        // hint (not a constraint)
            drawDistance={800}
            getItemType={() => 'product'}
            removeClippedSubviews

            // optional padding without any ScrollView
            contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 8 }}
        />

    );
});
