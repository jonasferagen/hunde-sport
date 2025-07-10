import type { Product } from '@/types';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { ProductDescription } from './_productDescription';
import ProductImage from './_productImage';
import { ProductPrice } from './_productPrice';
import { ProductShortDescription } from './_productShortDescription';
import { ProductTitle } from './_productTitle';

interface ProductDetailsProps {
  product: Product;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  return (
    <View style={styles.content}>
      <ProductTitle name={product.name} />
      {product.images.length > 0 && (
        <ProductImage image={product.images[0]} />
      )}
      <ProductPrice price={product.price} />
      <ProductShortDescription short_description={product.short_description} />
      <ProductDescription description={product.description} />

      <FlatList
        data={product.images.slice(1)}
        renderItem={({ item }) => <ProductImage image={item} />}
      />

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

  name: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
  }

});

export default ProductDetails;
