import { Icon, ListItem } from '@/components/ui';
import { useShoppingCart } from '@/contexts/ShoppingCartProvider';
import { useProductVariations } from '@/hooks/useProductVariations';
import { Product } from '@/types';
import { formatPrice, getScaledImageUrl } from '@/utils/helpers';
import React, { useState } from 'react';
import { LayoutChangeEvent, Pressable, StyleSheet, View } from 'react-native';
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
    const [imageDimensions, setImageDimensions] = useState({ width: 60, height: 60 });
    const { displayProduct, selectedOptions, handleSelectOption } = useProductVariations(product);

    const cartItem = items.find(item => item.product.id === displayProduct!.id);
    const quantity = cartItem?.quantity ?? 0;

    const handleLayout = (event: LayoutChangeEvent) => {
        const { width } = event.nativeEvent.layout;
        setImageDimensions({ width: Math.round(width), height: Math.round(width) });
    };

    const subtitle = product.short_description;

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

    const imageUrl = getScaledImageUrl(displayProduct!.images[0]?.src, imageDimensions.width, imageDimensions.height);

    const isPurchasable = canAddToCart(displayProduct);

    return (
        <View style={isExpanded ? [styles.expandedContainer, { height: expandedHeight }] : styles.container}>
            <ListItem
                index={index}
                title={product.name}
                subtitle={subtitle}
                imageUrl={imageUrl}
                price={formatPrice(displayProduct!.price)}
                onPress={handlePress}
                actionComponent={
                    isPurchasable ? (
                        <QuantityControl quantity={quantity} onIncrease={handleIncrease} onDecrease={handleDecrease} />
                    ) : (
                        <Pressable onPress={handlePress}>
                            <Icon name="next" size="xxl" />
                        </Pressable>
                    )
                }
            />
            {isExpanded && product.attributes
                .filter(attr => attr.variation)
                .map(attribute => {
                    return (
                        <VariationChips
                            key={attribute.id}
                            options={attribute.options}
                            selectedOption={selectedOptions[attribute.slug] || null}
                            onSelectOption={option => handleSelectOption(attribute.slug, option)}
                        />
                    );
                })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        // flex: 1,
    },
    expandedContainer: {
        borderWidth: 1,
        borderColor: 'black',
    },
});
