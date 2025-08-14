import { ThemedSpinner } from '@/components/ui/themed-components/ThemedSpinner';
import { PurchasableProviderInit } from '@/contexts/PurchasableContext';
import { Product, PurchasableProduct } from '@/types';
import { FlashList } from '@shopify/flash-list';
import React, { memo } from 'react';
import { Theme } from 'tamagui';
import { ProductCard } from './display/ProductCard';

interface ProductListProps {
    products: Product[];
    loadMore: () => void;
    loadingMore: boolean;

}

export const ProductList = memo(({
    products,
    loadMore,
    loadingMore,

}: ProductListProps) => {

    const keyExtractor = React.useCallback(
        (item: PurchasableProduct) => String(item.id),
        []
    );

    const renderItem = React.useCallback(
        ({ item: product, index }: { item: PurchasableProduct; index: number }) => (
            <PurchasableProviderInit product={product}>
                <ProductCard theme={index % 2 === 0 ? 'alt_tint' : 'alt_shade'} />
            </PurchasableProviderInit>
        ),
        []
    );

    // Prevent duplicate fetches
    const handleEndReached = React.useCallback(() => {
        if (!loadingMore) loadMore();
    }, [loadingMore, loadMore]);

    const Footer = React.useMemo(
        () => (loadingMore ? <ThemedSpinner my="$3" /> : null),
        [loadingMore]
    );

    return (
        <Theme name="light">
            <FlashList
                data={products as PurchasableProduct[]}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                onEndReached={handleEndReached}
                onEndReachedThreshold={0.8}
                ListFooterComponent={Footer}
                estimatedItemSize={150}
            />
        </Theme>

    );
}); 
