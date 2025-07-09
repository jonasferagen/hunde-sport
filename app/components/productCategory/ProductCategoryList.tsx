import React from 'react';
import { ActivityIndicator, FlatList, ListRenderItem, StyleSheet, Text, View } from 'react-native';
import type { ProductCategory } from '../../../types';
import ProductCategoryListItem from './ProductCategoryListItem';

interface ProductCategoryListProps {
  productCategories: ProductCategory[];
  loadMore: () => void;
  loadingMore: boolean;
}

const keyExtractor = (item: ProductCategory, index: number) => `${item.id}_${index}`;

const renderItem: ListRenderItem<ProductCategory> = ({ item }) => {
  return <ProductCategoryListItem {...item} />;
};

const ProductCategoryList: React.FC<ProductCategoryListProps> = ({ productCategories, loadMore, loadingMore }) => {
  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.loadingMore}>
        <Text>loading more</Text>
        <ActivityIndicator size="small" />
      </View>
    );
  };

  return (
    <FlatList
      data={productCategories}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      onEndReached={loadMore}
      onEndReachedThreshold={0.3}
      ListFooterComponent={renderFooter}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
      windowSize={11}
      removeClippedSubviews={true}
      showsVerticalScrollIndicator={false}
      getItemLayout={(data, index) => ({
        length: 50, // Height of your list item
        offset: 50 * index,
        index,
      })}
    />
  );
};

const styles = StyleSheet.create({
  loadingMore: {
    paddingVertical: 20,
  },
});

export default ProductCategoryList;
