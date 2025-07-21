import { CustomText, CustomTextProps } from '@/components/ui/text/CustomText';
import { SPACING } from '@/styles';
import { formatPrice } from '@/utils/helpers';
import React from 'react';
import { StyleSheet } from 'react-native';

interface PriceInfoProps {
    priceRange: { min: number; max: number };
    fontSize?: CustomTextProps['fontSize'];
}

export const PriceRange = ({ priceRange, fontSize = 'md' }: PriceInfoProps) => {
    const styles = createStyles();

    return (
        <CustomText fontSize={fontSize} style={styles.price}>
            Fra {formatPrice(priceRange.min)}
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
