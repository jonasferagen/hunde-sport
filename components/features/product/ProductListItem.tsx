import type { Product } from '@/types';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import ProductCard from '../../ui/ProductCard';

interface ProductListItemProps {
  product: Product;
  width?: number;
}

const ProductListItem: React.FC<ProductListItemProps> = ({ product, width = 160 }) => {

  const { id, name } = product;

  const handlePress = () => {
    router.push({
      pathname: '/product',
      params: {
        name,
        id: id.toString(),
      },
    });
  };


  return (
    <TouchableOpacity onPress={handlePress} style={[styles.container, { width }]}>
      <ProductCard product={product} width={width} />
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
