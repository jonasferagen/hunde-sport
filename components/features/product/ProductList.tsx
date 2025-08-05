import { ThemedSpinner } from '@/components/ui/ThemedSpinner';
import { ProductProvider } from '@/contexts';
import { ProductVariation } from '@/models/Product/ProductVariation';
import { SimpleProduct } from '@/models/Product/SimpleProduct';
import { VariableProduct } from '@/models/Product/VariableProduct';
import { FlashList } from "@shopify/flash-list";
import React, { memo, useCallback } from 'react';
import { ViewStyle } from 'react-native';
import { YStack } from 'tamagui';
import { ProductCard } from './card';

type Product = SimpleProduct | VariableProduct | ProductVariation;


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

    const renderItem = useCallback(({ item, index }: { item: Product, index: number }) => {

        return (
            <ProductProvider product={item}>
                <ProductCard
                    theme={index % 2 === 0 ? 'secondary_elevated' : 'secondary_soft'}
                    bbc="$borderColor"
                    bbw={1}
                />
            </ProductProvider>
        );
    }, []);

    const keyExtractor = useCallback((item: Product) => item.id.toString(), []);

    return <YStack flex={1}><FlashList
        data={products}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onEndReached={loadMore}
        onEndReachedThreshold={0.2}
        contentContainerStyle={contentContainerStyle}
        ListFooterComponent={() =>
            loadingMore ? <ThemedSpinner size="small" /> : null
        }
        estimatedItemSize={100}
    />
    </YStack>
});
