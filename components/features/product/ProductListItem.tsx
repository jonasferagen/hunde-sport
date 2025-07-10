import type { Product } from '@/types';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ProductImage from './_productImage';

const ProductListItem: React.FC<Product> = ({ id, name, images }) => {
  const handlePress = () => {
    // Navigate to product detail page (you'll need to create this page)
    router.push({
      pathname: '/product',
      params: {
        name: name,
        id: id.toString(),
      },
    });
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.container}>
      <View style={styles.card}>
        {images && images.length > 0 && <ProductImage image={images[0]} />}
        <Text style={styles.name}>{name}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
  },
  card: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  name: {
    marginTop: 10,
    fontWeight: 'bold',
    minHeight: 50,
    textOverflow: 'ellipsis',
    textAlign: 'center',
  },
});

export default ProductListItem;
