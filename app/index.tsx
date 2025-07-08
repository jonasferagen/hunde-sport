// app/index.tsx
import { router } from 'expo-router';
import { memo } from 'react';
import { ActivityIndicator, FlatList, ListRenderItem, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { Category } from '../types';
import CategoryImage from './components/category/CategoryImage';
import FullScreenLoader from './components/FullScreenLoader';
import RetryView from './components/RetryView';
import { useCategories } from './contexts/CategoryContext';


// Memoized list item component with areEqual comparison
const CategoryItem = memo<Category>(({ id, name, image }) => { 
  const handlePress = () => {
    router.push({
      pathname: "/category",
      params: { 
        name: name,
        id: id.toString()
      }
    });
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      
      <View style={styles.categoryItem}>
        {image && (
          <View style={styles.categoryImage}>
            <CategoryImage image={image} />
          </View>
        )}
        <Text 
          style={styles.categoryText} 
          numberOfLines={1} 
          ellipsizeMode="tail"
          selectable={false}
        >
          {name}
        </Text>
      </View>
    </TouchableOpacity>
  );
}, 
(prevProps, nextProps) => {
  return prevProps.id === nextProps.id && 
         prevProps.name === nextProps.name &&
         prevProps.image?.src === nextProps.image?.src;
});

// Memoized key extractor
const keyExtractor = (item: Category, index: number) => `${item.id}_${index}`;

// Memoized styles to prevent recreation on every render
const createStyles = () => {
  return StyleSheet.create({

    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
    },
    categoryItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 15,
      paddingLeft:0,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
    },
    categoryImage: {
      width: 40,
      height: 40,
      marginHorizontal: 15
    },
    categoryText: {
      flex: 1,
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
  const { categories, loading, loadingMore, error, loadMore, refresh } = useCategories();

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.loadingMore}>
        <ActivityIndicator size="small" />
      </View>
    );
  };

  const renderItem: ListRenderItem<Category> = ({ item }) => {

    return (
      <CategoryItem {...item} />
    );
  };

  if (loading && !loadingMore) {
    return <FullScreenLoader />;
  }

  if (error) {
    return <RetryView error={error} onRetry={refresh} />;
  }


  return (
    <View>
      <Text style={styles.title}>Hva leter du etter?</Text>
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