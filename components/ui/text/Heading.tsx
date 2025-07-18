import { CustomText } from '@/components/ui';
import { FONT_SIZES } from '@/styles';
import React from 'react';
import { StyleProp, TextStyle } from 'react-native';

interface HeadingProps {
    title?: string;
    style?: StyleProp<TextStyle>;
    size?: keyof typeof FONT_SIZES;
}

export const Heading = ({ title, style, size = 'md' }: HeadingProps) => {
    if (!title) {
        return null;
    }

    return <CustomText fontSize={size} style={style}>{title}</CustomText>;
};
