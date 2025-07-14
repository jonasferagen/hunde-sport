// app/home.tsx
import { StyleProp, StyleSheet, Text, TextStyle } from 'react-native';

import { FONT_SIZES } from '@/styles/Typography';


interface HeadingProps {
    title: string;
    size: keyof typeof FONT_SIZES;
    style?: StyleProp<TextStyle>;
}

export function Heading({ title, size, style }: HeadingProps) {
    const styles = createStyles(size);
    return <Text style={[styles.title, style]}>{title}</Text>

}

const createStyles = (size: keyof typeof FONT_SIZES) =>
    StyleSheet.create({
        title: {
            fontSize: FONT_SIZES[size],
            fontWeight: 'bold',
            textAlign: 'left',
        },
    });
