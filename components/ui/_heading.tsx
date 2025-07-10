// app/home.tsx
import { StyleSheet, Text } from 'react-native';

import { FONT_SIZES } from '@/styles/Typography';

export default function Heading({ title, size }: { title: string; size: keyof typeof FONT_SIZES }) {
    const styles = createStyles(size);
    return (
        <Text style={styles.title}>{title}</Text>
    );
}

const createStyles = (size: keyof typeof FONT_SIZES) => {
    return StyleSheet.create({
        title: {
            fontSize: FONT_SIZES[size],
            fontWeight: 'bold',
            marginBottom: 20,
            textAlign: 'center',
        },
    });
};

