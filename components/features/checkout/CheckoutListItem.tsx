import { CustomText } from '@/components/ui';
import { SPACING } from '@/styles';
import { ShoppingCartItem } from '@/types';
import { formatPrice } from '@/utils/helpers';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface CheckoutListItemProps {
    item: ShoppingCartItem;
}

export const CheckoutListItem: React.FC<CheckoutListItemProps> = ({ item }) => {
    const subtotal = item.product.price * item.quantity;

    return (
        <View style={styles.container}>
            <CustomText style={styles.name}>{item.product.name} ({item.quantity})</CustomText>
            <CustomText style={styles.subtotal}>{formatPrice(subtotal)}</CustomText>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: SPACING.sm,
        borderBottomWidth: 1,
        borderColor: '#eee',
        alignItems: 'center',
    },
    name: {
        flex: 1,
    },
    subtotal: {
        minWidth: 80,
        textAlign: 'right',
        fontWeight: 'bold',
    },
});