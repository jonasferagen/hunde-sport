import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import type { Product } from '../types';
import Breadcrumbs from './components/Breadcrumbs';
import FullScreenLoader from './components/FullScreenLoader';
import ProductDetails from './components/product/ProductDetails';
import ProductImage from './components/product/ProductImage';
import ProductTitle from './components/product/ProductTitle';

import { useBreadcrumbs } from './contexts/BreadcrumbContext/BreadcrumbProvider';
import { useProducts } from './contexts/ProductContext/ProductProvider';

export default function ProductScreen() {
  const { id } = useLocalSearchParams<{ id: string; name: string }>();
  const { getProductById } = useProducts(Number(id)); // Pass null, we only need the function
  const { breadcrumbs, setTrail } = useBreadcrumbs();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const numericId = Number(id);

      setLoading(true);
      try {
        const fetchedProduct = await getProductById(numericId);

        if (fetchedProduct) {
          setProduct(fetchedProduct);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, getProductById]);

  useEffect(() => {
    if (product) {
      setTrail({ id: product.id, name: product.name, type: 'product' });
    }
  }, [product]);

  // If id is missing, we can't do anything. This is a critical error.
  if (!id) {
    return <Text style={styles.errorText}>Product ID is missing.</Text>;
  }

  if (loading) {
    return <FullScreenLoader />;
  }

  if (error) {
    return <Text style={styles.errorText}>Error: {error}</Text>;
  }

  if (!product) {
    return <Text style={styles.errorText}>Product not found</Text>;
  }

  return (
    <ScrollView>
      <Stack.Screen options={{ title: product.name }} />
      <Breadcrumbs
        trail={breadcrumbs}
        onNavigate={(crumb) => {
          setTrail(crumb);
          if (crumb.id === null) {
            router.replace('/');
          } else if (crumb.type === 'category') {
            router.push({ pathname: '/productPage', params: { id: crumb.id.toString(), name: crumb.name } });
          }
        }}
      />
      <ProductTitle name={product.name} />
      {product.images && product.images.length > 0 && <ProductImage image={product.images[0]} />}
      <ProductDetails product={product} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  errorText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'red',
  },
});
