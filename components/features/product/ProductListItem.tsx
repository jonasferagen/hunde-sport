import { CustomText, Icon } from '@/components/ui';
import { Col, Row } from '@/components/ui/listitem/layout';
import { routes } from '@/config/routes';
import { useThemeContext } from '@/contexts';
import { useShoppingCartContext } from '@/contexts/ShoppingCartContext';

import { Product } from '@/models/Product';
import { formatPrice, getScaledImageUrl } from '@/utils/helpers';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { QuantityControl } from '../shoppingCart/QuantityControl';
import { ProductVariations } from './ProductVariations';

interface ProductListItemProps {
    product: Product;
    index: number;
    onPress: (id: number) => void;
    isExpanded: boolean;
    expandedHeight: number;
    categoryId?: number;
}

export const ProductListItem: React.FC<ProductListItemProps> = ({ product, index, onPress, isExpanded, expandedHeight, categoryId }) => {
    const { themeManager } = useThemeContext();
    const theme = themeManager.getVariant('card');
    const styles = createStyles(theme);

    const { items, addToCart, updateQuantity } = useShoppingCartContext();
    const [imageDimensions, setImageDimensions] = useState({ width: 80, height: 80 });
    const [productVariant, setProductVariant] = useState<Product | null>(null);

    useEffect(() => {
        if (product) {
            // Initially, the selected product is the base product itself.
            // The ProductVariations component will then update it to the default variation if available.
            setProductVariant(product);
        }
    }, [product]);

    if (!product) {
        return null;
    }

    // The product to display will be the selected variant, or fall back to the main product.
    const displayProduct = productVariant || product;

    if (!displayProduct) {
        // Don't render anything until the display product is initialized.
        return null;
    }

    const cartItem = items.find(item => item.product.id === product.id);
    const quantity = cartItem?.quantity ?? 0;

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
        onPress(product.id);
    }

    const imageUrl = getScaledImageUrl(displayProduct.images[0]?.src, imageDimensions.width, imageDimensions.height);

    const containerStyles = [
        styles.container,
        isExpanded && styles.expandedContainer,
        isExpanded && { height: expandedHeight },
    ];

    return (
        <View style={containerStyles}>
            <Row onPress={handlePress}>
                <Row>
                    {imageUrl && <Image source={{ uri: imageUrl }} style={[styles.image, imageDimensions]} />}
                    <Col style={styles.infoContainer}>
                        <CustomText style={styles.name} numberOfLines={2}>{displayProduct.name} {displayProduct.id} {displayProduct.type}</CustomText>
                        <CustomText style={styles.price}>{formatPrice(displayProduct.price)}</CustomText>
                    </Col>
                </Row>
                <Row onPress={() => router.push(routes.product(product, categoryId))} flex={0}>
                    <Icon name="next" size="xxl" color={theme.text.primary} />
                </Row>
            </Row>
            <Row>
                <CustomText style={styles.subtitle} numberOfLines={2}>{product.short_description}</CustomText>
                <View style={styles.actionContainer}>
                    <QuantityControl quantity={quantity} onIncrease={handleIncrease} onDecrease={handleDecrease} />
                </View>
            </Row>
            <ProductVariations
                product={product}
                onVariationChange={setProductVariant}
            />
            {isExpanded && (
                <View style={styles.variationsContainer}>
                    <CustomText>Hei</CustomText>
                </View>
            )}
        </View>
    );
};

const createStyles = (theme: any) => StyleSheet.create({
    container: {
        padding: 8,
        borderBottomWidth: 1,
        borderBottomColor: theme.borderColor,
    },
    expandedContainer: {
        justifyContent: 'flex-start',
    },
    image: {
        borderRadius: 8,
        marginRight: 12,
    },
    infoContainer: {
        flex: 1,
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
        color: theme.text.secondary,
        fontSize: 14,
    },
    actionContainer: {
        marginLeft: 16,
    },
    variationsContainer: {
        marginTop: 12,
    },
});