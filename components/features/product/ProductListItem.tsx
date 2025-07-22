import { Icon } from '@/components/ui';
import { CustomText } from '@/components/ui/text/CustomText';
import { routes } from '@/config/routes';
import { useThemeContext } from '@/contexts';
import { ProductProvider, useProductContext } from '@/contexts/ProductContext';
import { useShoppingCartContext } from '@/contexts/ShoppingCartContext';
import { Product } from '@/models/Product';
import { formatPrice, getScaledImageUrl } from '@/utils/helpers';
import { router } from 'expo-router';
import React from 'react';
import { Image, XStack, YStack } from 'tamagui';
import { QuantityControl } from '../shoppingCart/QuantityControl';
import { PriceTag } from './display/PriceTag';
import { ProductStatus } from './display/ProductStatus';
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

    const imageUrl = getScaledImageUrl(activeProduct.images[0]?.src, 80, 80);

    return (
        <YStack padding="$2" borderBottomWidth={1} borderColor={theme.borderColor} gap="$3">
            <XStack justifyContent="space-between" gap="$3">
                {/* Left Column: Image, Title, Description */}
                <XStack flex={1} onPress={handleProductLink} gap="$3">
                    <Image source={{ uri: imageUrl }} width={80} height={80} borderRadius="$4" />
                    <YStack flex={1} gap="$2">
                        <ProductTitle product={product} activeProduct={activeProduct} />
                        <CustomText color={theme.text.primary} numberOfLines={2} fontSize={14} lineHeight={20}>
                            {product.short_description}
                        </CustomText>
                    </YStack>
                </XStack>

                {/* Right Column: Price & Actions */}
                <YStack justifyContent="space-between" alignItems="flex-end" gap="$2">
                    {product.type === 'variable' && !productVariant ? (
                        <CustomText fontSize="md" bold>Fra {formatPrice(priceRange!.min)}</CustomText>
                    ) : (
                        <PriceTag fontSize="md" product={activeProduct} />
                    )}

                    {isPurchasable ? (
                        <QuantityControl
                            quantity={quantity}
                            onIncrease={handleIncrease}
                            onDecrease={handleDecrease}
                        />
                    ) : (
                        <ProductStatus displayProduct={activeProduct} fontSize="xs" />
                    )}

                    <XStack onPress={handlePress} gap="$2" alignItems="center">
                        {product.type === 'variable' && !productVariant && (
                            <CustomText fontSize="xs" color="$gray10">Velg variant</CustomText>
                        )}
                        <Icon
                            name={isExpanded ? 'collapse' : 'expand'}
                            size="md"
                            color={theme.text.primary}
                        />
                    </XStack>
                </YStack>
            </XStack>

            <YStack display={isExpanded ? 'flex' : 'none'}>
                <ProductVariations />
            </YStack>
        </YStack>
    );
};

/*          <Col style={{ paddingHorizontal: SPACING.md }}>
           
                </Col>
         <ProductVariations
                        displayAs="list"
                    />
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
    );
};