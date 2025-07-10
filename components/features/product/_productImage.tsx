import type { Image as ImageType } from '@/types';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
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
    borderWidth: 1,
    borderColor: '#fcc',
    width: '100%',
    minHeight: 100,
  },
  image: {
    borderColor: '#000',
    height: '100%',
  },
});

export default ProductImage;
