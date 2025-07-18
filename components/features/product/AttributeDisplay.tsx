import { CustomText } from '@/components/ui';
import { useThemeContext } from '@/contexts';
import { SPACING } from '@/styles';
import { FONT_SIZES } from '@/styles/Typography';
import { ProductAttribute as Attribute } from '@/types';
import { StyleSheet, View } from 'react-native';

interface AttributeDisplayProps {
    attribute: Attribute;
};

export const AttributeDisplay = ({ attribute }: AttributeDisplayProps) => {
    const { themeManager } = useThemeContext();
    const theme = themeManager.getVariant('primary');
    const styles = createStyles(theme);

    if (!attribute.options.length) {
        return null;
    }
    return (
        <View style={styles.container}>
            <CustomText style={styles.name}>{attribute.name}:</CustomText>
            <CustomText style={styles.value}>{attribute.options.join(', ')}</CustomText>
        </View>
    );
};

const createStyles = (theme: any) => StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginBottom: SPACING.sm,
    },
    name: {
        fontWeight: 'bold',
        marginRight: SPACING.sm,
        fontSize: FONT_SIZES.md,
        color: theme.text.primary,
    },
    value: {
        fontSize: FONT_SIZES.md,
        color: theme.text.primary,
    },
});
