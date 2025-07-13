import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { SvgUri } from 'react-native-svg';

import { Category } from '@/types';

interface CategoryIconProps {
    image: Category['image'];
    size: number;
    style?: StyleProp<ViewStyle> | StyleProp<TextStyle>;
}

export const CategoryIcon = ({ image, size, style }: CategoryIconProps) => {
    if (image?.src?.endsWith('.svg')) {
        return <SvgUri width={size} height={size} uri={image.src} style={style as StyleProp<ViewStyle>} />;
    }
    return <Ionicons name="pricetag-outline" size={size} color="black" style={style as StyleProp<TextStyle>} />;
};
