import type { Product } from '@/types';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import ProductCard from './ProductCard';


interface ProductListItemProps {
  product: Product;
  width?: number;
}

const ProductListItem: React.FC<ProductListItemProps> = ({ product, width = 160 }) => {


  const { id, name, images, price } = product;

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
    <TouchableOpacity onPress={handlePress} style={[styles.container, { width }]}>
      <ProductCard image={images[0]} title={name} price={price} width={width} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
  },


});

export default ProductListItem;
