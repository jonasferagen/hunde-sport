import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { Product } from '../../../types';

interface ProductDetailsProps {
  product: Product;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  // Function to strip HTML tags for clean text display
  const stripHtml = (html: string) => html.replace(/<[^>]*>?/gm, '');

  return (
    <View style={styles.content}>
      <Text style={styles.title}>{product.name}</Text>
      {product.short_description && (
        <Text style={styles.description}>{stripHtml(product.short_description)}</Text>
      )}
      {/* You can add more product details here, like the full description */}
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
});

export default ProductDetails;
