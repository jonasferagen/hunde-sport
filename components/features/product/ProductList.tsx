import { ThemedSpinner } from '@/components/ui/themed-components/ThemedSpinner';
import { PurchasableProviderInit } from '@/contexts/PurchasableContext';
import { Product, PurchasableProduct } from '@/types';
import { FlashList } from '@shopify/flash-list';
import React, { memo, useCallback } from 'react';
import { ViewStyle } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { XStack } from 'tamagui';
import { ProductCard } from './display/ProductCard';

interface ProductListProps {
    products: Product[];
    loadMore: () => void;
    loadingMore: boolean;
    contentContainerStyle?: ViewStyle;
}

export const ProductList = memo(({
    products,
    loadMore,
    loadingMore,
    contentContainerStyle
}: ProductListProps) => {


    const renderItem = useCallback(({ item: product, index }: { item: PurchasableProduct, index: number }) =>
        <Animated.View layout={LinearTransition}>
            <PurchasableProviderInit product={product}>
                <ProductCard theme={index % 2 === 0 ? 'normal' : 'soft'} />
            </PurchasableProviderInit>
        </Animated.View>
        , []);

    const keyExtractor = useCallback((item: PurchasableProduct) => item.id.toString(), []);

    return (
        <XStack f={1} theme="secondary">
            <FlashList
                data={products as PurchasableProduct[]}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
                contentContainerStyle={contentContainerStyle}
                ListFooterComponent={() =>
                    loadingMore ? <ThemedSpinner my="$3" /> : null
                }
                estimatedItemSize={200}
            />
        </XStack>
    );
}); 
