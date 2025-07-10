import type { Category } from '@/types';
import React from 'react';
import { ActivityIndicator, FlatList, ListRenderItem, StyleSheet, Text, View } from 'react-native';
import CategoryListItem from './CategoryListItem';

interface CategoryListProps {
  categoryProvider: any;
}

const keyExtractor = (item: Category, index: number) => `${item.id}_${index}`;

const renderItem: ListRenderItem<Category> = ({ item }) => {
  return <CategoryListItem {...item} />;
};

const CategoryList: React.FC<CategoryListProps> = (props) => {


  const { items, loadMore, loadingMore } = props.categoryProvider

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
      data={items}
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

export default CategoryList;
