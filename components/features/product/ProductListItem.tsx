import { useCart } from '@/hooks/Cart/CartProvider';
import { SPACING } from '@/styles/Dimensions';
import { FONT_SIZES } from '@/styles/Typography';
import type { Product } from '@/types';
import { formatPrice } from '@/utils/helpers';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

interface ProductListItemProps {
  product: Product;
}

const ProductListItem: React.FC<ProductListItemProps> = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <View key={product.id} style={styles.container}>
      <Image source={{ uri: product.images[0].src }} style={styles.image} />
      <View style={{ flex: 1, marginHorizontal: SPACING.md }}>
        <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
        <Text style={styles.price}>{formatPrice(product.price)}</Text>
      </View>
      <Pressable onPress={() => addToCart(product)}>
        <MaterialCommunityIcons name="basket-plus" size={24} color="black" />
      </Pressable>
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
  },
  name: {
    fontWeight: '600',
    fontSize: FONT_SIZES.md,
  },
  price: {
    color: 'gray',
    marginTop: 5,
  },
});

export default ProductListItem;
