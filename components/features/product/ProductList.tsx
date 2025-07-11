import { Product } from '@/types';
import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

interface ProductListProps {
    products: Product[];
    loadMore: () => void;
    loadingMore: boolean;
    HeaderComponent?: React.ReactElement;
    EmptyComponent?: React.ReactElement;
}

export default function ProductList({ products, loadMore, loadingMore, HeaderComponent, EmptyComponent }: ProductListProps) {
    return (
        <FlatList
            data={products}
            renderItem={({ item }) => (
                <View style={styles.itemContainer}>
                    <Text>{item.name}</Text>
                </View>
            )}
            keyExtractor={(item) => item.id.toString()}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            ListHeaderComponent={HeaderComponent}
            ListEmptyComponent={EmptyComponent}
            ListFooterComponent={() =>
                loadingMore ? <ActivityIndicator style={{ margin: 20 }} /> : null
            }
            contentContainerStyle={styles.listContainer}
        />
    );
}

const styles = StyleSheet.create({
    listContainer: {
        paddingHorizontal: 8,
    },
    itemContainer: {
        flex: 1,
        padding: 8,
    },
});
