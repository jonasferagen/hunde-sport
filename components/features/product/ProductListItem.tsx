import { Icon } from '@/components/ui';
import { CustomText } from '@/components/ui/text/CustomText';
import { routes } from '@/config/routes';
import { useThemeContext } from '@/contexts';
import { ProductProvider, useProductContext } from '@/contexts/ProductContext';
import { useShoppingCartContext } from '@/contexts/ShoppingCartContext';
import { Product } from '@/models/Product';
import { SPACING } from '@/styles';
import { formatPrice, getScaledImageUrl } from '@/utils/helpers';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Image, XStack, YStack } from 'tamagui';
import { QuantityControl } from '../shoppingCart/QuantityControl';
import { PriceTag } from './display/PriceTag';
import { ProductTitle } from './display/ProductTitle';
import { ProductVariations } from './variation/ProductVariations';

interface ProductListItemProps {
    product: Product;
    index: number;
    onPress: (id: number) => void;
    isExpanded: boolean;
    expandedHeight: number;
    categoryId?: number;
}

const ProductListItemContent: React.FC<Omit<ProductListItemProps, 'product'>> = ({
    onPress,
    isExpanded,
    categoryId,
}) => {
    const { themeManager } = useThemeContext();
    const theme = themeManager.getVariant('card');

    const { items, addToCart, updateQuantity, purchaseInfo } = useShoppingCartContext();
    const { product, priceRange, productVariant } = useProductContext();

    if (!product) {
        return null;
    }

    const activeProduct = productVariant || product;
    const { status } = purchaseInfo(activeProduct);
    const isPurchasable = status === 'ok';

    // The product to display will be the selected variant, or fall back to the main product.
    const cartItem = items.find((item) => (item.selectedVariant || item.baseProduct).id === activeProduct.id);
    const quantity = cartItem?.quantity ?? 0;

    const handleIncrease = () => {
        if (!isPurchasable) return;
        if (quantity === 0) {
            addToCart(product, productVariant ?? undefined);
        } else {
            updateQuantity(activeProduct.id, quantity + 1);
        }
    };

    const handleDecrease = () => {
        if (!isPurchasable) return;
        updateQuantity(activeProduct.id, quantity - 1);
    };

    const handleProductLink = () => {
        router.push(routes.product(product, categoryId));
    };

    const handlePress = () => {
        onPress(product.id);
    };

    const styles = createStyles(theme);
    const priceContainer = product.type === 'variable' && !productVariant && priceRange ? (
        <XStack alignItems="center" gap="$1" style={styles.priceContainer}>
            <CustomText fontSize="md" bold>Fra</CustomText><CustomText fontSize="md" bold>{formatPrice(priceRange.min)}</CustomText>
        </XStack>
    ) : (
        <PriceTag fontSize="md" product={activeProduct} />
    );


    const imageUrl = getScaledImageUrl(activeProduct.images[0]?.src, 80, 80);

    return (
        <YStack borderBottomWidth={1} borderColor={theme.borderColor} gap="$2" padding="$3">

            <XStack justifyContent="space-between" gap="$3">
                <XStack
                    alignSelf="stretch"
                    justifyContent="flex-start"
                    gap="$3"
                    style={{ width: '100%' }}
                >
                    {/* Product image */}
                    <YStack
                        alignItems="center"
                        justifyContent="center"

                    >
                        <Image source={{ uri: imageUrl }} width={80} height={80} borderRadius="$4" />
                    </YStack>

                    {/* Text section with title and price on the same line */}
                    <YStack flex={1} gap="$2" >

                        {/* Title + Price */}
                        <XStack justifyContent="space-between" alignItems="flex-start">
                            <YStack flex={1} paddingRight="$2"> {/* give room for price */}
                                <ProductTitle product={product} activeProduct={activeProduct} />
                            </YStack>

                            <CustomText
                                fontSize="md"
                                bold
                                style={{ backgroundColor: theme.backgroundColor }}
                            >
                                {formatPrice(product.price)}
                            </CustomText>
                        </XStack>

                        {/* Description */}
                        <CustomText fontSize="xs" color={theme.text.primary} numberOfLines={2}>
                            {product.short_description}
                        </CustomText>
                    </YStack>
                </XStack>
            </XStack>


            {/* Bottom Row: Actions */}
            <XStack justifyContent="space-between" alignItems="center" padding="$1" >

                <XStack onPress={handlePress} gap="$2" alignItems="center" marginLeft="$2">
                    <Icon
                        name={isExpanded ? 'collapse' : 'expand'}
                        size="lg"
                        color={theme.text.primary}
                    />
                    <CustomText fontSize="md" color="$gray10">Velg variant</CustomText>
                </XStack>
                {isPurchasable && (
                    <QuantityControl
                        quantity={quantity}
                        onIncrease={handleIncrease}
                        onDecrease={handleDecrease}
                    />
                )}
            </XStack>

            <YStack display={isExpanded ? 'flex' : 'none'} marginHorizontal="$3">
                <ProductVariations />
            </YStack>
        </YStack >
    );
};


export const ProductListItem: React.FC<ProductListItemProps> = ({ product, ...props }) => {
    return (
        <ProductProvider product={product}>
            <ProductListItemContent {...props} />
        </ProductProvider>
    );
};

const createStyles = (theme: any) => StyleSheet.create({
    priceContainer: {
        backgroundColor: theme.backgroundColor,
        paddingVertical: SPACING.xs,
        paddingHorizontal: SPACING.sm,
        borderRadius: SPACING.sm,
        borderColor: theme.borderColor,
        borderWidth: 1,
    },
});