import type { Product } from '@/types';
import { stripHtml } from '@/utils/helpers';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ProductDetailsProps {
  product: Product;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  return (
    <View style={styles.content}>
      {product.short_description && (
        <Text style={styles.description}>{product.id} {stripHtml(product.short_description)}</Text>
      )}
      {/* You can add more product details here, like the full description */}
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 20,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
});

export default ProductDetails;
