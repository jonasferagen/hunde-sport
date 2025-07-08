import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { useProducts } from './contexts/ProductContext';

export default function ProductScreen() {
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
  const { product, loading, getProductById } = useProducts();

  console.log(product);

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
      {product.images && product.images.length > 0 && (
        <View style={styles.imageContainer}>
          {product.images.map((image, index) => (
            <View key={index} style={styles.imageWrapper}>
              {image.src.endsWith('.svg') ? (
                <SvgUri
                  width="100%"
                  height={200}
                  uri={image.src}
                  style={styles.image}
                />
              ) : (
                <Image
                  source={{ uri: image.src }}
                  style={styles.image}
                  resizeMode="contain"
                />
              )}
            </View>
          ))}
        </View>
      )}
      
      <View style={styles.content}>
        <Text style={styles.title}>{product.id} aaa</Text>
        
        {product.short_description && (
          <Text style={styles.shortDescription}>
            {product.short_description.replace(/<[^>]*>?/gm, '')}
          </Text>
        )}
        
        {product.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>
              {product.description.replace(/<[^>]*>?/gm, '')}
            </Text>
          </View>
        )}
      </View>
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
    backgroundColor: '#fff',
  },
  imageContainer: {
    marginBottom: 20,
  },
  imageWrapper: {
    width: '100%',
    height: 300,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  shortDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    lineHeight: 24,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
});
