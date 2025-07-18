import { CustomText } from '@/components/ui';
import { useThemeContext } from '@/contexts';
import { SPACING } from '@/styles';
import { ShoppingCartItem } from '@/types';
import { formatPrice } from '@/utils/helpers';
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { CheckoutListItem } from './CheckoutListItem';

interface CheckoutListProps {
    items: ShoppingCartItem[];
    cartTotal: number;
}

export const CheckoutList: React.FC<CheckoutListProps> = ({ items, cartTotal }) => {
    const { themeManager } = useThemeContext();
    const theme = themeManager.getVariant('primary');
    const styles = createStyles(theme);
    return (
        <View style={styles.container}>
            <FlatList
                data={items}
                renderItem={({ item }) => <CheckoutListItem item={item} />}
                keyExtractor={(item) => item.product.id.toString()}
                ListFooterComponent={() => (
                    <View style={styles.totalContainer}>
                        <CustomText style={styles.totalText}>Total:</CustomText>
                        <CustomText style={styles.totalAmount}>{formatPrice(cartTotal)}</CustomText>
                    </View>
                )}
            />
        </View>
    );
};

const createStyles = (theme: any) => StyleSheet.create({
    container: {
        flex: 1,
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: SPACING.md,
        paddingTop: SPACING.md,
        borderTopWidth: 1,
        borderColor: theme.borderColor,
    },
    totalText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.text.primary,
    },
    totalAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.text.primary,
    },
});
