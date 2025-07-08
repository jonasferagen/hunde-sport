import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import FullScreenLoader from './components/FullScreenLoader';
import ProductDetails from './components/product/ProductDetails';
import ProductImage from './components/product/ProductImage';
import ProductTitle from './components/product/ProductTitle';
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
    return <FullScreenLoader />;
  }

  if (!product) {
    return (
      <Text>Product not found</Text>
    );
  }

  return (
    <ScrollView>
      <ProductTitle name={product.name} />
      {product.images && product.images.length > 0 && (
        <View style={styles.imageContainer}>
          {product.images.map((image, index) => (
            <ProductImage key={`${image.src}-${index}`} image={image} />
          ))}
        </View>
      )}
      <ProductDetails product={product} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    marginBottom: 20,
  },
});
