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

    const renderItem = ({ item: product, index }: { item: PurchasableProduct, index: number }) =>
        <PurchasableProviderInit product={product}>
            <ProductCard theme={index % 2 === 0 ? 'tint' : 'shade'} />
        </PurchasableProviderInit>

    const keyExtractor = (item: PurchasableProduct) => item.id.toString();

    return (
        <Theme name="light_alt">
            <FlashList
                data={products as PurchasableProduct[]}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                onEndReached={loadMore}
                onEndReachedThreshold={0.8}
                ListFooterComponent={() =>
                    loadingMore ? <ThemedSpinner my="$3" /> : null
                }
                estimatedItemSize={200}
            />
        </Theme>

    );
}); 
