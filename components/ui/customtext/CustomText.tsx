import React from 'react';
import { Text, TextProps } from 'react-native';

import { FONT_FAMILY, FONT_SIZES } from '@/styles/Typography';


export interface CustomTextProps extends TextProps {
    size?: keyof typeof FONT_SIZES;
    bold?: boolean;
}

export const CustomText = (props: CustomTextProps) => {
    const { size = 'md', bold = false, style, children, ...rest } = props;

    if (!children) {
        return null;
    }

    const textStyle = React.useMemo(() => ({
        fontSize: FONT_SIZES[size],
        fontFamily: bold ? FONT_FAMILY.bold : FONT_FAMILY.regular,
    }), [size, bold]);

    return <Text style={[textStyle, style]} {...rest}>{children}</Text>
}
