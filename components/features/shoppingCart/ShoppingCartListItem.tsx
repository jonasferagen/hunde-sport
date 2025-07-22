import { Icon, ListItem } from '@/components/ui/';
import { routes } from '@/config/routes';
import { useThemeContext } from '@/contexts';
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
    const { themeManager } = useThemeContext();
    const accentVariant = themeManager.getVariant('accent');
    const product = item.selectedVariant || item.baseProduct;

    const handleIncrease = () => {
        onUpdateQuantity(item.baseProduct.id, item.quantity + 1);
    };

    const handleDecrease = () => {
        onUpdateQuantity(item.baseProduct.id, item.quantity - 1);
    };

    const handleRemove = () => {
        onRemove(item.baseProduct.id);
    };

    const handlePress = () => {
        router.push(routes.product(item.baseProduct));
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
                <CustomText>Subtotal: {formatPrice(product.price * item.quantity)}</CustomText>
            </View>
        </View>
    );

    return (
        <ListItem
            index={index}
            product={product}
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
