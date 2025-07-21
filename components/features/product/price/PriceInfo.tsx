import { DiscountBadge } from '@/components/ui/badge/DiscountBadge';
import { CustomText } from '@/components/ui/text/CustomText';
import { useThemeContext } from '@/contexts';
import { SPACING } from '@/styles';
import { Product } from '@/types';
import { formatPrice } from '@/utils/helpers';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface PriceInfoProps {
    product: Product;
}

export const PriceInfo = ({ product }: PriceInfoProps) => {
    const { themeManager } = useThemeContext();
    const theme = themeManager.getVariant('card');
    const styles = createStyles(theme);
    const { price } = product;
    const regularPrice = 100;
    const salePrice = 50;
    const onSale = true;
    if (onSale) {
        return (
            <View style={styles.container}>
                <View style={styles.priceContainer}>
                    <CustomText fontSize='sm' style={styles.regularPrice}>
                        {formatPrice(regularPrice)}
                    </CustomText>
                    <CustomText fontSize='sm' style={styles.salePrice}>
                        {formatPrice(salePrice)}
                    </CustomText>
                </View>
                <DiscountBadge regularPrice={regularPrice} salePrice={salePrice} />
            </View>
        );
    }

    return (
        <View style={[styles.container, styles.priceOnlyContainer]}>
            <CustomText fontSize='sm' style={styles.price}>{formatPrice(price)}</CustomText>
        </View>
    );
};

const createStyles = (theme: any) => StyleSheet.create({
    container: {
        alignItems: 'flex-end',
    },
    priceOnlyContainer: {
        backgroundColor: theme.backgroundColor,
        paddingVertical: SPACING.xs,
        paddingHorizontal: SPACING.sm,
        borderRadius: SPACING.sm,
    },
    priceContainer: {
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
