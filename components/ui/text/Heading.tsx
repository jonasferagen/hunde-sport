import { CustomText } from '@/components/ui';
import React from 'react';
import { StyleProp, TextStyle } from 'react-native';

interface HeadingProps {
    title?: string;
    style?: StyleProp<TextStyle>;
    size?: 'md';
}

export const Heading = ({ title, style, size = 'md' }: HeadingProps) => {
    if (!title) {
        return null;
    }

    return <CustomText style={style}>{title}</CustomText>;
};
