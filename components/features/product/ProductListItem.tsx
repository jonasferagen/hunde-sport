import { CustomText, Icon } from '@/components/ui';
import { useShoppingCart } from '@/contexts/ShoppingCartProvider';
import { useProductVariations } from '@/hooks/useProductVariations';
import { Product } from '@/types';
import { formatPrice, getScaledImageUrl } from '@/utils/helpers';
import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { QuantityControl } from '../shoppingCart/QuantityControl';
import { VariationChips } from './VariationChips';

interface ProductListItemProps {
    product: Product;
    index: number;
    onPress: (id: number) => void;
    isExpanded: boolean;
    expandedHeight: number;
}

export const ProductListItem: React.FC<ProductListItemProps> = ({ product, index, onPress, isExpanded, expandedHeight }) => {
    const { items, addToCart, updateQuantity, canAddToCart } = useShoppingCart();
    const [imageDimensions, setImageDimensions] = useState({ width: 80, height: 80 });
    const { displayProduct, selectedOptions, handleSelectOption } = useProductVariations(product);

    const cartItem = items.find(item => item.product.id === displayProduct!.id);
    const quantity = cartItem?.quantity ?? 0;

    const handleIncrease = () => {
        if (quantity === 0) {
            addToCart(displayProduct!);
        } else {
            updateQuantity(displayProduct!.id, quantity + 1);
        }
    };

    const handleDecrease = () => {
        updateQuantity(displayProduct!.id, quantity - 1);
    };

    const handlePress = () => {
        onPress(product.id);
    }

    if (!displayProduct) {
        throw new Error("displayProduct is undefined" + product.id);
    }


    const imageUrl = getScaledImageUrl(displayProduct!.images[0]?.src, imageDimensions.width, imageDimensions.height);
    const isPurchasable = canAddToCart(displayProduct);

    const containerStyles = [
        styles.container,
        isExpanded && styles.expandedContainer,
        isExpanded && { height: expandedHeight },
    ];

    return (
        <View style={containerStyles}>
            <Pressable onPress={handlePress} style={styles.pressableContainer}>
                <View style={styles.topRow}>
                    {imageUrl && <Image source={{ uri: imageUrl }} style={[styles.image, imageDimensions]} />}
                    <View style={styles.infoContainer}>
                        <CustomText style={styles.name} numberOfLines={2}>{product.name}</CustomText>
                        <CustomText style={styles.price}>{formatPrice(displayProduct!.price)}</CustomText>
                    </View>
                </View>
                <View style={styles.bottomRow}>
                    <CustomText style={styles.subtitle} numberOfLines={2}>{product.short_description}</CustomText>
                    <View style={styles.actionContainer}>
                        {isPurchasable ? (
                            <QuantityControl quantity={quantity} onIncrease={handleIncrease} onDecrease={handleDecrease} />
                        ) : (
                            <Icon name="next" size="xxl" />
                        )}
                    </View>
                </View>
            </Pressable>
            {isExpanded && (
                <View style={styles.variationsContainer}>
                    {product.attributes
                        .filter(attr => attr.variation)
                        .map(attribute => (
                            <VariationChips
                                key={attribute.id}
                                options={attribute.options}
                                selectedOption={selectedOptions[attribute.slug] || null}
                                onSelectOption={option => handleSelectOption(attribute.slug, option)}
                            />
                        ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    expandedContainer: {
        justifyContent: 'flex-start',
    },
    pressableContainer: {
        //
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    image: {
        borderRadius: 8,
        marginRight: 12,
    },
    infoContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    name: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 4,
    },
    price: {
        fontSize: 16,
    },
    subtitle: {
        flex: 1,
        color: '#666',
        fontSize: 14,
    },
    actionContainer: {
        marginLeft: 16,
    },
    variationsContainer: {
        marginTop: 12,
    },
});