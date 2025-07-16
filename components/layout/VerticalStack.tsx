import { SPACING } from '@/styles';
import React, { Children } from 'react';
import { View, ViewProps } from 'react-native';

interface VerticalStackProps extends ViewProps {
    children: React.ReactNode;
    spacing?: keyof typeof SPACING;
}

export const VerticalStack = ({ children, spacing = 'md', style, ...props }: VerticalStackProps) => {
    return (
        <View style={style} {...props}>
            {Children.toArray(children).filter(child => Boolean(child))}
        </View>
    );
};
