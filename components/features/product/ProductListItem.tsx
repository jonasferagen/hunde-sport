import { CustomText, Icon } from '@/components/ui';
import { Col, Row } from '@/components/ui/listitem/layout';
import { routes } from '@/config/routes';
import { useThemeContext } from '@/contexts';
import { useShoppingCartContext } from '@/contexts/ShoppingCartContext';
import { useProductVariations } from '@/hooks/useProductVariations';

import { Product } from '@/models/Product';
import { SPACING } from '@/styles';
import { formatPrice, getScaledImageUrl } from '@/utils/helpers';
import { router } from 'expo-router';
import React from 'react';
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

    const {
        productVariant,
        availableOptions,
    } = useProductVariations(product);

    // The product to display will be the selected variant, or fall back to the main product.
    const displayProduct = productVariant || product;

    const cartItem = items.find(item => item.product.id === displayProduct.id);
    const quantity = cartItem?.quantity ?? 0;

    const handleIncrease = () => {
        if (quantity === 0) {
            addToCart(displayProduct);
        } else {
            updateQuantity(displayProduct.id, quantity + 1);
        }
    };

    const handleDecrease = () => {
        updateQuantity(displayProduct.id, quantity - 1);
    };

    const handlePress = () => {
        onPress(product.id);
    }

    const imageUrl = getScaledImageUrl(displayProduct.images[0]?.src, 80, 80);

    const containerStyles = [
        styles.container,
    ];


    const handleVariantChange = (variant: Product | null) => {
        if (variant) {

        }
    };

    const hasVariations = availableOptions.size > 0;


    return (
        <View style={containerStyles}>
            <Row onPress={handlePress}>
                <Row justifyContent='space-between' alignItems='center'>
                    {imageUrl && <Image source={{ uri: imageUrl }} style={[styles.image, { width: 80, height: 80 }]} />}
                    <Col style={styles.infoContainer}>
                        <CustomText style={styles.name} numberOfLines={2}>{displayProduct.name}</CustomText>
                        <CustomText style={styles.price}>{formatPrice(displayProduct.price)}</CustomText>
                        {hasVariations && !isExpanded && (
                            <Row style={styles.variationIndicator} flex={0}>
                                <Icon name="exclamation" size="md" color={theme.text.primary} />
                                <CustomText style={styles.variationText}>Flere varianter</CustomText>
                            </Row>
                        )}
                    </Col>

                </Row>

            </Row>
            <Row justifyContent='space-between' alignItems='center'>
                <Col flex={0} onPress={handlePress}>
                    <Icon name="more" size="xxl" color={theme.text.primary} />
                </Col>
                <Col alignItems='flex-end'>
                    <QuantityControl quantity={quantity} onIncrease={handleIncrease} onDecrease={handleDecrease} />
                </Col>
            </Row>

            {
                isExpanded && (
                    <Col style={{ paddingHorizontal: SPACING.md }}>
                        <ProductVariations
                            product={product}
                            onVariantChange={handleVariantChange}
                        />
                        <CustomText style={styles.subtitle}>
                            {product.short_description}{' '}
                            <CustomText style={[styles.link, { borderWidth: 1, borderColor: 'red', padding: 4 }]} onPress={() => router.push(routes.product(product, categoryId))}>
                                Til produktside <Icon name="next" size="sm" color={theme.text.primary} />
                            </CustomText>
                        </CustomText>
                    </Col>
                )
            }
        </View>
    )
};

const createStyles = (theme: any) => StyleSheet.create({
    container: {
        padding: 8,
        borderBottomWidth: 1,
        borderBottomColor: theme.borderColor,
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
    link: {
        color: theme.text.primary,
        fontSize: 14,
        fontWeight: 'bold',
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