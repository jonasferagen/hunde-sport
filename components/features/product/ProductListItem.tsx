import { CustomText, Icon } from '@/components/ui';
import { routes } from '@/config/routes';
import { useShoppingCart } from '@/contexts/ShoppingCartProvider';
import { FONT_SIZES, SPACING } from '@/styles';
import { Product } from '@/types';
import { formatPrice, getScaledImageUrl } from '@/utils/helpers';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { Image, LayoutChangeEvent, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';

interface ProductListItemProps {
    product: Product;
}

export const ProductListItem: React.FC<ProductListItemProps> = ({ product }) => {
    const { items, addToCart, updateQuantity } = useShoppingCart();
    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

    const cartItem = items.find(item => item.product.id === product.id);
    const quantity = cartItem?.quantity ?? 0;

    const handleLayout = (event: LayoutChangeEvent) => {
        const { width } = event.nativeEvent.layout;
        setImageDimensions({ width: Math.round(width), height: Math.round(width) });
    };

    const imageUrl = getScaledImageUrl(product.images[0]?.src, imageDimensions.width, imageDimensions.height);

    const subtitle = product.short_description;

    const renderQuantityControl = () => {
        if (quantity > 0) {
            return (
                <View style={styles.quantityContainer}>
                    <Pressable onPress={() => updateQuantity(product.id, quantity - 1)} style={styles.quantityButton}>
                        <Icon name="remove" size="xl" color="#888" />
                    </Pressable>
                    <CustomText style={styles.quantityText}>{quantity}</CustomText>
                    <Pressable onPress={() => updateQuantity(product.id, quantity + 1)} style={styles.quantityButton}>
                        <Icon name="add" size="xl" color="#888" />
                    </Pressable>
                </View>
            );
        }
        return (
            <Pressable onPress={() => addToCart(product)} style={styles.quantityButton}>
                <Icon name="add" size="xl" color="#007AFF" />
            </Pressable>
        );
    };

    return (
        <View style={styles.itemContainer}>
            <View style={styles.topRow}>
                <Link href={routes.product(product)} asChild>
                    <TouchableOpacity style={styles.pressableContent}>
                        <View onLayout={handleLayout} style={styles.imageContainer}>
                            {imageUrl && <Image source={{ uri: imageUrl }} style={styles.image} />}
                        </View>
                        <View style={styles.infoContainer}>
                            <CustomText style={styles.name} numberOfLines={1}>{product.name}</CustomText>
                        </View>
                    </TouchableOpacity>
                </Link>
                <CustomText style={styles.price}>{formatPrice(product.price)}</CustomText>
                {renderQuantityControl()}
            </View>
            {!!subtitle && (
                <View style={styles.bottomRow}>
                    <CustomText style={styles.subtitle} numberOfLines={2}>{subtitle}</CustomText>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    itemContainer: {
        flex: 1,
        marginTop: SPACING.sm,
        backgroundColor: 'white',
        padding: SPACING.md,
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    bottomRow: {
        marginLeft: 60 + SPACING.md, // Aligns subtitle with the title
        marginTop: SPACING.xs,
    },
    pressableContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1, // Make it take up available space
    },
    infoContainer: {
        flex: 1,
        marginHorizontal: SPACING.md
    },
    imageContainer: {
        width: 60, // Increased size
        height: 60, // Increased size
        borderRadius: SPACING.sm, // Rounded corners
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    name: {
        fontWeight: '600',
        fontSize: FONT_SIZES.md,
        flexShrink: 1, // Allow text to shrink if needed
    },
    price: {
        fontWeight: '600',
        fontSize: FONT_SIZES.md,
        marginHorizontal: SPACING.md,
    },
    subtitle: {
        color: 'gray',
        fontSize: FONT_SIZES.sm,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        minWidth: 90,
    },
    quantityButton: {
        padding: SPACING.sm,
    },
    quantityText: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '600',
        minWidth: 20,
        textAlign: 'center',
    },
});
