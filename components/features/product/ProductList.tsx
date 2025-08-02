import { ThemedSpinner } from '@/components/ui/ThemedSpinner';
import { useLayoutContext } from '@/contexts';
import { Product } from '@/models/Product/Product';
import { FlashList } from "@shopify/flash-list";
import React, { memo, useCallback, useState } from 'react';
import { ViewStyle } from 'react-native';
import { YStack } from 'tamagui';
import { ProductListItem } from './ProductListItem';

interface ProductListProps {
    products: Product[];
    loadMore?: () => void;
    loadingMore: boolean;
    contentContainerStyle?: ViewStyle;
    categoryId?: number;
}

export const ProductList = memo(({
    products,
    loadMore,
    loadingMore,
    contentContainerStyle,
    categoryId
}: ProductListProps) => {
    const [expandedProductId, setExpandedProductId] = useState<number | null>(null);
    const { layout } = useLayoutContext();

    const handleItemPress = useCallback((id: number) => {
        setExpandedProductId(prevId => (prevId === id ? null : id));
    }, []);

    const renderItem = useCallback(({ item, index }: { item: Product, index: number }) => {
        const expandedHeight = layout.height * 0.6;
        return (
            <ProductListItem

                product={item}
                index={index}
                onPress={handleItemPress}
                isExpanded={expandedProductId === item.id}
                expandedHeight={expandedHeight}
                categoryId={categoryId}
            />
        );
    }, [expandedProductId, handleItemPress, layout.height, categoryId]);

    const keyExtractor = useCallback((item: Product) => item.id.toString(), []);

    return <YStack flex={1}><FlashList
        data={products}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        contentContainerStyle={contentContainerStyle}
        ListFooterComponent={() =>
            loadingMore ? <ThemedSpinner size="small" /> : null
        }
        estimatedItemSize={100}
        extraData={expandedProductId}
    />
    </YStack>
});
