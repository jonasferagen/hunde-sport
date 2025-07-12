import { Loader } from '@/components/ui';
import { Product } from '@/types';
import { FlashList } from "@shopify/flash-list";
import { router } from 'expo-router';
import React, { memo, useCallback } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import ProductListItem from './ProductListItem';

interface RenderProductProps {
    item: Product;
    onPress: (id: number) => void;
}

const RenderProduct = memo(({ item, onPress }: RenderProductProps) => (
    <TouchableOpacity
        onPress={() => onPress(item.id)}
        style={styles.itemContainer}>
        <ProductListItem product={item} />
    </TouchableOpacity>
));

interface ProductListProps {
    products: Product[];
    loadMore: () => void;
    loadingMore: boolean;
    HeaderComponent?: React.ReactElement;
    EmptyComponent?: React.ReactElement;
}

export default function ProductList({ products, loadMore, loadingMore, HeaderComponent, EmptyComponent }: ProductListProps) {
    const handleProductPress = useCallback((id: number) => {
        router.push({ pathname: '/product', params: { id: id.toString() } });
    }, []);

    const renderItem = useCallback(({ item }: { item: Product }) => (
        <RenderProduct item={item} onPress={handleProductPress} />
    ), [handleProductPress]);

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
            ListFooterComponent={() =>
                loadingMore ? <Loader /> : null
            }
            contentContainerStyle={styles.listContainer}
            estimatedItemSize={50}
        />
    );
}

const styles = StyleSheet.create({

    listStyle: {
        flex: 1,
    },
    listContainer: {
        paddingHorizontal: 8,
    },
    itemContainer: {
        flex: 1,
        padding: 8,
    },
});
