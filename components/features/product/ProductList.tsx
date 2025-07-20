import { Loader } from '@/components/ui';
import { useLayoutContext } from '@/contexts';
import { SPACING } from '@/styles';
import { Product } from '@/models/Product';
import { FlashList } from "@shopify/flash-list";
import React, { memo, useCallback, useState } from 'react';
import { ViewStyle } from 'react-native';
import { ProductListItem } from './ProductListItem';

interface ProductListProps {
    products: Product[];
    loadMore?: () => void;
    loadingMore: boolean;
    contentContainerStyle?: ViewStyle;
    categoryId?: number;
}

export const ProductList = memo(({ products, loadMore, loadingMore, contentContainerStyle, categoryId }: ProductListProps) => {
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

    return <FlashList style={{ flex: 1 }}
        data={products}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        contentContainerStyle={contentContainerStyle}
        ListFooterComponent={() =>
            loadingMore ? <Loader style={{ paddingVertical: SPACING.lg }} flex /> : null
        }
        estimatedItemSize={100}
        extraData={expandedProductId}
    />

});
