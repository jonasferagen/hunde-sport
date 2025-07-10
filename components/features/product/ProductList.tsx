import type { Product } from '@/types';
import React from 'react';
import { ActivityIndicator, FlatList, ListRenderItem, StyleSheet, View } from 'react-native';
import ProductListItem from './ProductListItem';

interface ProductListProps {
    products: Product[];
    loadMore: () => void;
    loadingMore: boolean;
}

const keyExtractor = (item: Product, index: number) => `${item.id}_${index}`;

const renderItem: ListRenderItem<Product> = ({ item }) => {
    return <ProductListItem {...item} />;
};

const ProductList: React.FC<ProductListProps> = ({ products, loadMore, loadingMore }) => {
    const renderFooter = () => {
        if (!loadingMore) return null;
        return (
            <View style={styles.loadingMore}>
                <ActivityIndicator size="small" />
            </View>
        );
    };

    return (
        <FlatList
            data={products}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            onEndReached={loadMore}
            onEndReachedThreshold={0.3}
            ListFooterComponent={renderFooter}
            numColumns={2} // A common pattern for product lists
            showsVerticalScrollIndicator={false}
        />
    );
};

const styles = StyleSheet.create({
    loadingMore: {
        paddingVertical: 20,
    },
});

export default ProductList;
