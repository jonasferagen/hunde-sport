import { Loader } from '@/components/ui';
import { Product } from '@/types';
import { FlashList } from "@shopify/flash-list";
import React, { memo, useCallback } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { ProductListItem } from './ProductListItem';

interface RenderProductProps {
    item: Product;
}

const RenderProduct = memo(({ item }: RenderProductProps) => (
    <ProductListItem product={item} />
));

interface ProductListProps {
    products: Product[];
    loadMore: () => void;
    loadingMore: boolean;
    HeaderComponent?: React.ReactElement;
    EmptyComponent?: React.ReactElement;
    contentContainerStyle?: ViewStyle;
}

export const ProductList = memo(({ products, loadMore, loadingMore, HeaderComponent, EmptyComponent, contentContainerStyle }: ProductListProps) => {
    const renderItem = useCallback(({ item }: { item: Product }) => (
        <RenderProduct item={item} />
    ), []);

    const keyExtractor = useCallback((item: Product) => item.id.toString(), []);

    return (

        <FlashList style={styles.listStyle}
            data={products}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            ListHeaderComponent={HeaderComponent}
            ListEmptyComponent={EmptyComponent}
            contentContainerStyle={contentContainerStyle}
            ListFooterComponent={() =>
                loadingMore ? <Loader /> : null
            }
            estimatedItemSize={50}
        />

    );
});

const styles = StyleSheet.create({

    listStyle: {
        flex: 1,
    },

});
