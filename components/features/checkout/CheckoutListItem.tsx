import { CustomText } from '@/components/ui';
import { useThemeContext } from '@/contexts';
import { SPACING } from '@/styles';
import { ShoppingCartItem } from '@/types';
import { formatPrice } from '@/utils/helpers';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface CheckoutListItemProps {
    item: ShoppingCartItem;
}

export const CheckoutListItem: React.FC<CheckoutListItemProps> = ({ item }) => {
    const { themeManager } = useThemeContext();
    const theme = themeManager.getVariant('primary');
    const styles = createStyles(theme);
    const subtotal = item.product.price * item.quantity;

    return (
        <View style={styles.container}>
            <CustomText style={styles.name} color={theme.text.primary}>{item.product.name} ({item.quantity})</CustomText>
            <CustomText style={styles.subtotal} color={theme.text.primary}>{formatPrice(subtotal)}</CustomText>
        </View>
    );
};

const createStyles = (theme: any) => StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: SPACING.sm,
        borderBottomWidth: 1,
        borderColor: theme.borderColor,
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