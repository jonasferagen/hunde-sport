// app/home.tsx
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { FONT_SIZES } from '@/styles/Typography';


interface HeadingProps {
    title: string;
    size: keyof typeof FONT_SIZES;
    style?: StyleProp<ViewStyle>;
}

export default function Heading({ title, size, style }: HeadingProps) {
    const styles = createStyles(size);
    return (
        <View style={style}>
            <Text style={styles.title}>{title}</Text>
        </View>
    );
}

const createStyles = (size: keyof typeof FONT_SIZES) =>
    StyleSheet.create({
        title: {
            fontSize: FONT_SIZES[size],
            fontWeight: 'bold',
            textAlign: 'center',
        },
    });
