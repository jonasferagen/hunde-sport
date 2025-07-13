import React from 'react';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { SvgUri } from 'react-native-svg';

import { Icon } from '@/components/ui';
import { Category } from '@/types';

interface CategoryIconProps {
    image: Category['image'];
    size: number;
    style?: StyleProp<ViewStyle> | StyleProp<TextStyle>;
}

const TAG_ICON_NAME = 'tag';

export const CategoryIcon = ({ image, size, style }: CategoryIconProps) => {
    if (image?.src?.endsWith('.svg')) {
        return <SvgUri width={size} height={size} uri={image.src} style={style as StyleProp<ViewStyle>} color="white" />;
    }
    return <Icon name={TAG_ICON_NAME} size={size} color="white" style={style as StyleProp<TextStyle>} />
};
