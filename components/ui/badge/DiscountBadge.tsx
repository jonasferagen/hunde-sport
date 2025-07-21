import { CustomText } from '@/components/ui/text/CustomText';
import { useThemeContext } from '@/contexts';
import { BORDER_RADIUS, SPACING } from '@/styles';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface DiscountBadgeProps {
    regularPrice: number;
    salePrice: number;
}

export const DiscountBadge = ({ regularPrice, salePrice }: DiscountBadgeProps) => {
    const { themeManager } = useThemeContext();
    const theme = themeManager.getVariant('accent');
    const styles = createStyles(theme);

    if (regularPrice <= salePrice) {
        return null;
    }

    const discount = Math.round(((regularPrice - salePrice) / regularPrice) * 100);

    return (
        <View style={styles.container}>
            <CustomText fontSize="sm" style={styles.text}>
                -{discount}%
            </CustomText>
        </View>
    );
};

const createStyles = (theme: any) => StyleSheet.create({
    container: {
        backgroundColor: theme.backgroundColor,
        borderRadius: BORDER_RADIUS.md,
        paddingVertical: SPACING.xs,
        paddingHorizontal: SPACING.sm,
        alignSelf: 'flex-start',
    },
    text: {
        color: theme.text.primary,
        fontWeight: 'bold',
    },
});
