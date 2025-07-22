import React from 'react';
import { StyleProp, Text, TextProps, TextStyle } from 'react-native';

import { useThemeContext } from '@/contexts';
import { FONT_SIZES } from '@/styles/Typography';

export interface CustomTextProps extends TextProps {
    fontSize?: keyof typeof FONT_SIZES;
    bold?: boolean;
    color?: string;
    style?: StyleProp<TextStyle>;
}

export const CustomText = (props: CustomTextProps) => {
    const { fontSize: size = 'md', bold = false, color = 'black', style, children, ...rest } = props;

    const { themeManager } = useThemeContext();
    const theme = themeManager.getVariant('default');

    if (!children) {
        return null;
    }

    const textStyle = {
        fontSize: FONT_SIZES[size],
        color: color || theme.text.primary,
        fontWeight: bold ? "600" : "400" as TextStyle['fontWeight'],
    };


    return <Text style={[textStyle, style]} {...rest}>{children}</Text>
}
