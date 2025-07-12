import type { Product } from '@/types';
import { formatPrice } from '@/utils/helpers';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

interface ProductListItemProps {
  product: Product;
}

const ProductListItem: React.FC<ProductListItemProps> = ({ product }) => {

  return (
    <View key={product.id} style={styles.container}>
      <Image source={{ uri: product.images[0].src }} style={styles.image} />
      <View>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>{formatPrice(product.price)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  name: {
    fontWeight: '600',
    fontSize: 16,
  },
  price: {
    color: 'gray',
  },
});

export default ProductListItem;
