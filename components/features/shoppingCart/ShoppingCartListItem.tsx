import { Icon, ListItem } from '@/components/ui/';
import { routes } from '@/config/routes';
import { useTheme } from '@/contexts';
import { ShoppingCartItem } from '@/types';
import { formatPrice } from '@/utils/helpers';
import { router } from 'expo-router';
import React from 'react';
import { Text as CustomText, Pressable, StyleSheet, View } from 'react-native';
import { QuantityControl } from './QuantityControl';

interface ShoppingCartListItemProps {
    item: ShoppingCartItem;
    index: number;
    onUpdateQuantity: (productId: number, quantity: number) => void;
    onRemove: (productId: number) => void;
}

export const ShoppingCartListItem: React.FC<ShoppingCartListItemProps> = ({ item, index, onUpdateQuantity, onRemove }) => {
    const { themeManager } = useTheme();
    const accentVariant = themeManager.getVariant('accent');

    const handleIncrease = () => {
        onUpdateQuantity(item.product.id, item.quantity + 1);
    };

    const handleDecrease = () => {
        onUpdateQuantity(item.product.id, item.quantity - 1);
    };

    const handleRemove = () => {
        onRemove(item.product.id);
    };

    const handlePress = () => {
        router.push(routes.product(item.product));
    }

    const actionComponent = (
        <View style={styles.actionContainer}>
            <Pressable onPress={handlePress} style={styles.backButton}>
                <Icon name="prev" color={accentVariant.text.primary} />
            </Pressable>
            <View style={styles.rightActions}>
                <View style={styles.quantityAndRemove}>
                    <QuantityControl
                        quantity={item.quantity}
                        onIncrease={handleIncrease}
                        onDecrease={handleDecrease}
                    />
                    <Pressable onPress={handleRemove} style={styles.removeButton}>
                        <Icon name="emptyCart" color={accentVariant.text.primary} />
                    </Pressable>
                </View>
                <CustomText>Subtotal: {formatPrice(item.product.price * item.quantity)}</CustomText>
            </View>
        </View>
    );

    return (
        <ListItem
            index={index}
            product={item.product}
            actionComponent={actionComponent}
            onPress={handlePress}
        />
    );
};

const styles = StyleSheet.create({
    actionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    removeButton: {
        padding: 8,
        marginLeft: 8,
    },
    backButton: {
        padding: 8,
    },
    rightActions: {
        alignItems: 'flex-end',
    },
    quantityAndRemove: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});
