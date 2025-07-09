import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import type { Image as ImageType } from '../../types';
interface ProductImageProps {
  image: ImageType;
}

const ProductImage: React.FC<ProductImageProps> = ({ image }) => {
  return (
    <View style={styles.imageWrapper}>
      <Image
        source={{ uri: image.src }}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  imageWrapper: {
    marginBottom: 10,
    width: '100%',
  },
  image: {
    width: '100%',
    height: 150,
  },
});

export default ProductImage;
