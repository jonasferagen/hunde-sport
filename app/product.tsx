import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import ProductDetails from './components/product/ProductDetails';
import ProductImage from './components/product/ProductImage';
import { useProducts } from './contexts/ProductContext';

export default function ProductScreen() {
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
  const { product, loading, getProductById } = useProducts();

  useEffect(() => {
    if (id) {
      getProductById(parseInt(id, 10));
    }
  }, [id]);

  if (loading && !product) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.container}>
        <Text>Product not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text>{product.name}</Text>
      {product.images && product.images.length > 0 && (
        <View style={styles.imageContainer}>
          {product.images.map((image) => (
            <ProductImage key={image.src} image={image} />
          ))}
        </View>
      )}
      <ProductDetails product={product} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    marginBottom: 20,
  },
});
