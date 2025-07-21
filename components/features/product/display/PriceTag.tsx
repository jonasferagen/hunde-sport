import { CustomText, CustomTextProps } from '@/components/ui/text/CustomText';
import { SPACING } from '@/styles';
import { Product } from '@/types';
import { formatPrice } from '@/utils/helpers';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface PriceInfoProps {
    product: Product;
    fontSize?: CustomTextProps['fontSize'];
}

export const PriceTag = ({ product, fontSize = 'md' }: PriceInfoProps) => {
    const styles = createStyles();


    if (product.on_sale) {
        return (
            <View style={styles.discountContainer}>
                <CustomText fontSize={fontSize} style={styles.regularPrice}>
                    {formatPrice(product.regular_price)}
                </CustomText>
                <CustomText fontSize={fontSize} style={styles.price}>
                    {formatPrice(product.sale_price)}
                </CustomText>
            </View>
        );
    }

    return (
        <CustomText fontSize={fontSize} style={styles.price}>
            {formatPrice(product.price)}
        </CustomText>
    );
};

const createStyles = () => StyleSheet.create({
    discountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    regularPrice: {
        textDecorationLine: 'line-through',
        marginRight: SPACING.sm,
        opacity: 0.7,
    },
    price: {
        fontWeight: 'bold',
    },
});
