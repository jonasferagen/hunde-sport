import { CustomText } from '@/components/ui/text/CustomText';
import { useThemeContext } from '@/contexts';
import { SPACING } from '@/styles';
import { Product } from '@/types';
import { formatPrice } from '@/utils/helpers';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface PriceInfoProps {
    product: Product;
    themeVariant?: 'primary' | 'secondary' | 'accent' | 'default' | 'card';
}

export const PriceInfo = ({ product, themeVariant }: PriceInfoProps) => {
    const { themeManager } = useThemeContext();
    const theme = themeManager.getVariant(themeVariant ?? 'primary');
    const styles = createStyles(theme);

    if (product.on_sale) {
        return (
            <View style={[styles.container, styles.priceContainer]}>
                <View style={styles.discountContainer}>
                    <CustomText fontSize='sm' style={styles.regularPrice}>
                        {formatPrice(product.regular_price)}
                    </CustomText>
                    <CustomText fontSize='sm' style={styles.salePrice}>
                        {formatPrice(product.sale_price)}
                    </CustomText>
                </View>

            </View>
        );
    }

    return (
        <View style={[styles.container, styles.priceContainer]}>
            <CustomText fontSize='sm' style={styles.price}>{formatPrice(product.price)}</CustomText>
        </View>
    );
};

const createStyles = (theme: any) => StyleSheet.create({
    container: {
        alignItems: 'flex-end',
    },
    priceContainer: {
        backgroundColor: theme.backgroundColor,
        paddingVertical: SPACING.xs,
        paddingHorizontal: SPACING.sm,
        borderRadius: SPACING.sm,
    },
    discountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginBottom: SPACING.xs,
    },
    regularPrice: {
        textDecorationLine: 'line-through',
        marginRight: SPACING.sm,
        opacity: 0.7,
        color: theme.text.primary,
    },
    salePrice: {
        fontWeight: 'bold',
        color: theme.text.primary,
    },
    price: {
        fontWeight: 'bold',
        color: theme.text.primary,
    },
});
