// app/index.tsx
import { memo } from 'react';
import { ActivityIndicator, FlatList, ListRenderItem, StyleSheet, Text, View } from 'react-native';
import { useCategories } from './contexts/CategoryContext';

// Define prop types for better type checking
interface CategoryItemProps {
  item: { id: number; name: string };
}

// Memoized list item component with areEqual comparison
const CategoryItem = memo(({ item }: CategoryItemProps) => (
  <View style={styles.categoryItem}>
    <Text 
      style={styles.categoryText} 
      numberOfLines={1} 
      ellipsizeMode="tail"
      selectable={false}
    >
      {item.name}
    </Text>
  </View>
), 
// Custom comparison function to prevent unnecessary re-renders
(prevProps, nextProps) => {
  return prevProps.item.id === nextProps.item.id && 
         prevProps.item.name === nextProps.item.name;
});

// Memoized key extractor
const keyExtractor = (item: { id: number }, index: number) => `${item.id}_${index}`;

// Memoized styles to prevent recreation on every render
const createStyles = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#fff',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
    },
    categoryItem: {
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
    },
    categoryText: {
      fontSize: 16,
    },
    error: {
      color: 'red',
      textAlign: 'center',
    },
    loadingMore: {
      paddingVertical: 20,
    },
  });
};

const styles = createStyles();

export default function Index() {
  const { categories, loading, loadingMore, error, loadMore } = useCategories();

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.loadingMore}>
        <ActivityIndicator size="small" />
      </View>
    );
  };

  const renderItem: ListRenderItem<{ id: number; name: string }> = ({ item }) => (
    <CategoryItem item={item} />
  );

  if (loading && !loadingMore) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kategorier</Text>
      <FlatList
        data={categories}
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
    </View>
  );
}