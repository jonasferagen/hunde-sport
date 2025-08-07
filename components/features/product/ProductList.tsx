import { ThemedSpinner } from '@/components/ui/ThemedSpinner';
import { ProductProvider } from '@/contexts';
import { Product, PurchasableProduct } from '@/types';
import { FlashList } from "@shopify/flash-list";
import React, { memo, useCallback } from 'react';
import { ViewStyle } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { Theme, XStack } from 'tamagui';
import { ProductCard } from './card';

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

    const renderItem = useCallback(({ item, index }: { item: PurchasableProduct, index: number }) =>
        <Animated.View
            layout={LinearTransition}
        >
            <ProductProvider product={item}>
                <Theme name={index % 2 === 0 ? 'secondary_elevated' : 'secondary_soft'}>
                    <ProductCard />
                </Theme>
            </ProductProvider>
        </Animated.View>
        , []);

    const keyExtractor = useCallback((item: Product) => item.id.toString(), []);

    return (
        <XStack f={1}>
            <FlashList
                data={products} a
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
                contentContainerStyle={contentContainerStyle}
                ListFooterComponent={() =>
                    loadingMore ? <ThemedSpinner /> : null
                }
                estimatedItemSize={100}
            />
        </XStack>
    );
}); 
