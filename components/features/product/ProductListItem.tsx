import { CustomText, Icon } from '@/components/ui';
import { Col, Row } from '@/components/ui/layout';
import { routes } from '@/config/routes';
import { useThemeContext } from '@/contexts';
import { ProductProvider, useProductContext } from '@/contexts/ProductContext';
import { useShoppingCartContext } from '@/contexts/ShoppingCartContext';

import { Product } from '@/models/Product';
import { SPACING } from '@/styles';
import { formatPrice, getScaledImageUrl } from '@/utils/helpers';
import { router } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { QuantityControl } from '../shoppingCart/QuantityControl';
import { ProductVariations } from './variation/ProductVariations';

interface ProductListItemProps {
    product: Product;
    index: number;
    onPress: (id: number) => void;
    isExpanded: boolean;
    expandedHeight: number;
    categoryId?: number;
}

const ProductListItemContent: React.FC<Omit<ProductListItemProps, 'product'>> = ({ index, onPress, isExpanded, expandedHeight, categoryId }) => {
    const { themeManager } = useThemeContext();
    const theme = themeManager.getVariant('card');
    const styles = createStyles(theme);

    const { items, addToCart, updateQuantity } = useShoppingCartContext();
    const { displayProduct, product, variationAttributes, priceRange } = useProductContext();

    // The product to display will be the selected variant, or fall back to the main product.
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


    const handleProductLink = () => {
        router.push(routes.product(product, categoryId));
    };

    const handlePress = () => {
        onPress(product.id);
    }


    const imageUrl = getScaledImageUrl(displayProduct!.images[0]?.src, 80, 80);

    const containerStyles = [
        styles.container,
    ];

    const hasVariations = variationAttributes.length > 0;


    return (
        <View style={containerStyles}>
            <Row>
                <Row alignItems='center' onPress={handleProductLink}>
                    {imageUrl && <Image source={{ uri: imageUrl }} style={[styles.image, { width: 80, height: 80 }]} />}
                    <Col>
                        <Row style={{ flexGrow: 0 }} >
                            <CustomText style={styles.name} numberOfLines={2}>{displayProduct!.name}</CustomText>
                        </Row>
                        <Row justifyContent='space-between' style={[styles.variationIndicator, { flexGrow: 0 }]} >
                            <Col>
                                <CustomText style={styles.price}>
                                    {priceRange
                                        ? `Fra ${formatPrice(priceRange.min)}`
                                        : formatPrice(displayProduct!.price)}
                                </CustomText>
                            </Col>
                            <Row onPress={handlePress}>
                                <Icon name="exclamation" size="md" color={theme.text.primary} />
                                <CustomText style={styles.variationText}>Flere varianter</CustomText>
                            </Row>
                        </Row>
                    </Col>
                </Row>
            </Row>

            <Row justifyContent='space-between' alignItems='center'>
                <Col onPress={handlePress}>
                    <CustomText>
                        <Icon name={isExpanded ? "collapse" : "expand"} size="md" color={theme.text.primary} />
                    </CustomText>
                </Col>
                <Col alignItems='flex-end' style={{ flexGrow: .5 }}>
                    <QuantityControl quantity={quantity} onIncrease={handleIncrease} onDecrease={handleDecrease} />
                </Col>
            </Row>

            <View
                style={[{
                    display: isExpanded ? 'flex' : 'none',
                }]}
            >
                <Row >
                    <CustomText style={styles.subtitle}>
                        {product.short_description}{' '}
                    </CustomText>
                </Row>
                <Col style={{ paddingHorizontal: SPACING.md }}>
                    <ProductVariations
                        displayAs="chips"
                    />
                </Col>
            </View>
        </View >
    )
};

/*
   <View style={[styles.variationIndicator, { flexDirection: 'row' }]} >
                                <Icon name="exclamation" size="md" color={theme.text.primary} />
                                <CustomText style={styles.variationText}>Flere varianter</CustomText>
                            </View>
*/

export const ProductListItem: React.FC<ProductListItemProps> = ({ product, ...props }) => {
    return (
        <ProductProvider product={product}>
            <ProductListItemContent {...props} />
        </ProductProvider>
    )
}

const createStyles = (theme: any) => StyleSheet.create({


    link: {
        alignSelf: 'flex-end',
        marginTop: 'auto',
        color: '#666',
    },

    container: {
        padding: 8,
        borderBottomWidth: 1,
        borderBottomColor: theme.borderColor,
    },
    image: {
        borderRadius: 8,
        marginRight: 12,
    },

    name: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 4,
    },
    price: {
        fontSize: 16,
    },
    descriptionContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-end',
    },
    subtitle: {
        color: theme.text.primary,
        fontSize: 14,
        lineHeight: 20,
    },

    variationIndicator: {
        marginTop: SPACING.sm,
        alignItems: 'center',
    },
    variationText: {
        marginLeft: SPACING.xs,
        fontSize: 12,
        color: theme.text.primary,
    }
});