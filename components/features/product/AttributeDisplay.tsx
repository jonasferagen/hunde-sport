import { SPACING } from '@/styles';
import { FONT_SIZES } from '@/styles/Typography';
import { Attribute } from '@/types';
import { StyleSheet, Text, View } from 'react-native';

interface AttributeDisplayProps {
    attribute: Attribute;
};

export const AttributeDisplay = ({ attribute }: AttributeDisplayProps) => {

    if (!attribute.options.length) {
        return null;
    }
    return (
        <View style={styles.container}>
            <Text style={styles.name}>{attribute.name}:</Text>
            <Text style={styles.value}>{attribute.options.join(', ')}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginBottom: SPACING.sm,
    },
    name: {
        fontWeight: 'bold',
        marginRight: SPACING.sm,
        fontSize: FONT_SIZES.md,
    },
    value: {
        fontSize: FONT_SIZES.md,
    },
});
