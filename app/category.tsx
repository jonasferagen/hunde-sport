import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, Button, FlatList, StyleSheet, Text, View } from 'react-native';
import { useProducts } from './contexts/ProductContext';

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

  const renderItem = ({ item }: { item: { id: number; name: string } }) => (
    <View style={styles.productItem}>
      <Text style={styles.productText}>{item.name}</Text>
    </View>
  );

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
        <Button onPress={() => setCategoryId(id ? parseInt(id, 10) : null)} title="Retry" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        onEndReached={() => {
          if (!loading && hasMore) {
            loadMore();
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContent: {
    padding: 16,
  },
  productItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
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
