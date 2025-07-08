import { Product } from '@/types';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { memo, useEffect } from 'react';
import { ActivityIndicator, FlatList, ListRenderItemInfo, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FullScreenLoader from './components/FullScreenLoader';
import RetryView from './components/RetryView';
import { useProducts } from './contexts/ProductContext';

const ProductItem = memo<Product>(({ id, name }) => {
  const handlePress = () => {
    router.push({
      pathname: "/product",
      params: { 
        name: name,
        id: id.toString()
      }
    });
  };

  return (
    <TouchableOpacity 
      style={styles.productItem}
      onPress={handlePress}
    >
      <Text style={styles.productText}>{name}</Text>
    </TouchableOpacity>
  );
}, (prevProps, nextProps) => {
  return prevProps.id === nextProps.id && prevProps.name === nextProps.name;
});

const keyExtractor = (item: Product) => item.id.toString();

export default function CategoryScreen() {
  const { name, id } = useLocalSearchParams<{ name: string; id?: string }>();
  const { products, loading, error, hasMore, loadMore, setCategoryId } = useProducts();
  const navigation = useNavigation();

  useEffect(() => {
    if (id) {
      setCategoryId(parseInt(id, 10));
    }
    
    // Set the header title
    navigation.setOptions({
      title: name || 'Category',
    });
    
    return () => {
      setCategoryId(null);
    };
  }, [id, name, navigation]);

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.loadingMore}>
        <ActivityIndicator size="small" />
      </View>
    );
  };

  const renderItem = ({item}: ListRenderItemInfo<Product>) => {
    return <ProductItem {...item} />;
  };

  if (loading && products.length === 0) {
    return <FullScreenLoader />;
  }

  if (error) {
    return <RetryView error={error} onRetry={() => setCategoryId(id ? parseInt(id, 10) : null)} />;
  }

  return (
    <FlatList
      data={products}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      contentContainerStyle={styles.listContent}
      onEndReached={() => {
        if (!loading && hasMore) {
          loadMore();
        }
      }}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={11}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: 16,
  },
  productItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  productText: {
    fontSize: 16,
  },
  loadingMore: {
    paddingVertical: 20,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    margin: 20,
  },
});
