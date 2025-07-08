import React from 'react';
import { Text, View } from 'react-native';
import { SvgUri } from 'react-native-svg';
import type { Image as ImageType } from '../../../types';
interface CategoryImageProps {
  image: ImageType;
}

const CategoryImage: React.FC<CategoryImageProps> = ({ image }) => {

    if (!image.src.endsWith(".svg")) {
        return (
            <View>
                <Text>x</Text>
            </View>
        );
    }
    return (
        <SvgUri 
            uri={image.src}
        />

  );
};


export default CategoryImage;
