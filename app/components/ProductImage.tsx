import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { SvgUri } from 'react-native-svg';
import type { Image as ImageType } from '../../types';

interface ProductImageProps {
  image: ImageType;
}

const ProductImage: React.FC<ProductImageProps> = ({ image }) => {
  return (
    <View style={styles.imageWrapper}>
      {image.src.endsWith('.svg') ? (
        <SvgUri
          width="100%"
          height={200}
          uri={image.src}
          style={styles.image}
        />
      ) : (
        <Image
          source={{ uri: image.src }}
          style={styles.image}
          resizeMode="contain"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  imageWrapper: {
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 200,
  },
});

export default ProductImage;
