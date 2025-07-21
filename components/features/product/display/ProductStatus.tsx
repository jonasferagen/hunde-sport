import { CustomText, Icon } from '@/components/ui';
import { Row } from '@/components/ui/layout';
import { useShoppingCartContext } from '@/contexts';
import { Product } from '@/models/Product';
import { FONT_SIZES } from '@/styles';
import React from 'react';
import { StyleSheet } from 'react-native';

interface ProductStatusProps {
    displayProduct: Product;
    fontSize?: keyof typeof FONT_SIZES;
    short?: boolean;
}

export const ProductStatus = ({ displayProduct, fontSize = 'md', short = false }: ProductStatusProps) => {
    const { purchaseInfo } = useShoppingCartContext();
    const { status, msg, msgShort: shortMsg } = purchaseInfo(displayProduct);
    const message = short ? shortMsg : msg;

    const styles = createStyles();

    if (status === 'outofstock') {
        return (
            <Row alignItems="center" style={styles.container}>
                <Icon name="outofstock" size={fontSize} color='red' />
                <CustomText fontSize={fontSize} bold color='red'>{message}</CustomText>
            </Row>
        );
    }

    if (status === 'variantneeded') {
        return (
            <Row alignItems="center" style={styles.container}>
                <Icon name="exclamation" size={fontSize} color='grey' />
                <CustomText fontSize={fontSize} bold color='grey'>{message}</CustomText>
            </Row>
        );
    }

    return null;
};

const createStyles = () => StyleSheet.create({
    container: {
        flex: 0
    },
});


