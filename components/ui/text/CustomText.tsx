import React from 'react';
import { Text, TextProps } from 'react-native';

import { FONT_FAMILY, FONT_SIZES } from '@/styles/Typography';

export interface CustomTextProps extends TextProps {
    fontSize?: keyof typeof FONT_SIZES;
    bold?: boolean;
    color?: string;
}

export const CustomText = (props: CustomTextProps) => {
    const { fontSize: size = 'md', bold = false, color, style, children, ...rest } = props;

    if (!children) {
        return null;
    }

    const textStyle = React.useMemo(() => ({
        fontSize: FONT_SIZES[size],
        fontFamily: bold ? FONT_FAMILY.bold : FONT_FAMILY.regular,
        color: color || 'black',
    }), [size, bold, color]);

    return <Text style={[textStyle, style]} {...rest}>{children}</Text>
}
