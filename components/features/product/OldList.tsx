import type { Product } from '@/types';
import React from 'react';
import { ActivityIndicator, FlatList, ListRenderItem, StyleSheet, View } from 'react-native';
import ProductListItem from './OldProductListItem';

interface ProductListProps {
    products: Product[];
    loadMore: () => void;
    loadingMore: boolean;
    itemHeight?: number; // Optional prop to control item height
}

const ProductList: React.FC<ProductListProps> = ({
    products,
    loadMore,
    loadingMore,
    itemHeight = 200, // Default height, can be overridden
}) => {
    const renderItem: ListRenderItem<Product> = ({ item }) => (
        <View style={{ height: itemHeight }}>
            <ProductListItem product={item} />
        </View>
    );

    const renderFooter = () => {
        if (!loadingMore) return null;
        return (
            <View style={[styles.loadingMore, { height: itemHeight }]}>
                <ActivityIndicator size="small" />
            </View>
        );
    };

    return (
        <View style={[styles.container, { height: itemHeight }]}>
            <FlatList
                data={products}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                horizontal={true}
                contentContainerStyle={styles.listContent}
                onEndReached={loadMore}
                onEndReachedThreshold={0.1}
                ListFooterComponent={renderFooter}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                getItemLayout={(data, index) => ({
                    length: 160, // Width of each item
                    offset: 160 * index, // Width * index
                    index,
                })}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    listContent: {
        paddingHorizontal: 16,
        alignItems: 'center',
    },
    loadingMore: {
        width: 160,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ProductList;
