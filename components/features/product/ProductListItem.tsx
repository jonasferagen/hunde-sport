import { ListItem } from '@/components/ui';
import { routes } from '@/config/routes';
import { useShoppingCart } from '@/contexts/ShoppingCartProvider';
import { Product } from '@/types';
import { formatPrice, getScaledImageUrl } from '@/utils/helpers';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { LayoutChangeEvent } from 'react-native';
import { QuantityControl } from '../shoppingCart/QuantityControl';

interface ProductListItemProps {
    product: Product;
    index: number;
}

export const ProductListItem: React.FC<ProductListItemProps> = ({ product, index }) => {
    const { items, addToCart, updateQuantity } = useShoppingCart();
    const [imageDimensions, setImageDimensions] = useState({ width: 60, height: 60 });

    const cartItem = items.find(item => item.product.id === product.id);
    const quantity = cartItem?.quantity ?? 0;

    const handleLayout = (event: LayoutChangeEvent) => {
        const { width } = event.nativeEvent.layout;
        setImageDimensions({ width: Math.round(width), height: Math.round(width) });
    };



    const subtitle = product.short_description;

    const handleIncrease = () => {
        if (quantity === 0) {
            addToCart(product);
        } else {
            updateQuantity(product.id, quantity + 1);
        }
    };

    const handleDecrease = () => {
        updateQuantity(product.id, quantity - 1);
    };

    const handlePress = () => {
        router.push(routes.product(product));
    }

    const imageUrl = getScaledImageUrl(product.images[0]?.src, imageDimensions.width, imageDimensions.height);

    return (
        <ListItem
            index={index}
            title={product.name}
            subtitle={subtitle}
            imageUrl={imageUrl}
            price={formatPrice(product.price)}
            onPress={handlePress}
            actionComponent={<QuantityControl quantity={quantity} onIncrease={handleIncrease} onDecrease={handleDecrease} />}
        />
    );
};
