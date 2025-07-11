import type { Product } from '@/types';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ProductListItemProps {
  product: Product;
}

const ProductListItem: React.FC<ProductListItemProps> = ({ product }) => {

  return (
    <View style={styles.container}>
      <Text>{product.name + 'ad'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 5,
  },

});

export default ProductListItem;
