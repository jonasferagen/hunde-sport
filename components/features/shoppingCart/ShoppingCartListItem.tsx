import { Icon, ListItem } from '@/components/ui/';
import { routes } from '@/config/routes';
import { useTheme } from '@/contexts';
import { ShoppingCartItem } from '@/types';
import { formatPrice } from '@/utils/helpers';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { QuantityControl } from './QuantityControl';

interface ShoppingCartListItemProps {
    item: ShoppingCartItem;
    onUpdateQuantity: (productId: number, quantity: number) => void;
    onRemove: (productId: number) => void;
}

export const ShoppingCartListItem: React.FC<ShoppingCartListItemProps> = ({ item, onUpdateQuantity, onRemove }) => {
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
            <QuantityControl
                quantity={item.quantity}
                onIncrease={handleIncrease}
                onDecrease={handleDecrease}
            />
            <Pressable onPress={handleRemove} style={styles.removeButton}>
                <Icon name="emptyCart" color={accentVariant.text.primary} />
            </Pressable>
        </View>
    );

    return (
        <ListItem
            title={item.product.name}
            subtitle={formatPrice(item.product.price)}
            imageUrl={item.product.images[0]?.src}
            onPress={handlePress}
            actionComponent={actionComponent}
        />
    );
};

const styles = StyleSheet.create({
    actionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    removeButton: {
        padding: 8,
        marginLeft: 8,
    },
});
