import { ProductCard, ProductCardImage } from '@/components/features/product/card';
import { ProductProvider, useShoppingCartContext } from '@/contexts';
import { ShoppingCartItem } from '@/types';
import { formatPrice } from '@/utils/helpers';
import { Minus, Plus, X } from '@tamagui/lucide-icons';
import React from 'react';
import { Button, H5, SizableText, Theme, XStack, YStack } from 'tamagui';

interface ShoppingCartListItemProps {
    item: ShoppingCartItem;
}

const ShoppingCartListItemContent = ({ item }: ShoppingCartListItemProps) => {
    const { increaseQuantity, decreaseQuantity, removeItem } = useShoppingCartContext();
    const { product, productVariation, quantity } = item;
    const activeProduct = productVariation || product;

    return (
        <ProductCard>
            <Theme name="secondary">
                <YStack gap="$3" flex={1}>
                    <XStack gap="$3" ai="center">
                        <ProductCardImage product={product} imageSize={40} />
                        <XStack ai="center" gap="$2" flex={1}>
                            <H5>{product.name}</H5>
                            {productVariation && <H5>{productVariation.name}</H5>}
                        </XStack>
                    </XStack>
                    <XStack ai="center" jc="space-between">
                        <Button
                            theme="secondary"
                            icon={<X />}
                            onPress={() => removeItem(product, productVariation, { silent: true })}
                            size="$6"
                            circular
                        />
                        <SizableText fontSize="$6" fontWeight="bold">
                            {formatPrice(activeProduct.price * quantity)}
                        </SizableText>
                        <XStack ai="center" gap="$2" theme="secondary">
                            <Button
                                theme="accent"
                                icon={<Minus size="$4" />}
                                onPress={() => decreaseQuantity(product, productVariation, { silent: true })}
                                size="$6"
                                circular
                            />

                            <SizableText fontSize="$6" width={30} textAlign="center" theme="light">
                                {quantity}
                            </SizableText>
                            <Button
                                theme="accent"
                                icon={<Plus size="$4" />}
                                onPress={() => increaseQuantity(product, productVariation, { silent: true })}
                                size="$6"
                                circular
                            />
                        </XStack>
                    </XStack>
                </YStack>
            </Theme>
        </ProductCard>
    );
};

export const ShoppingCartListItem = ({ item }: ShoppingCartListItemProps) => {
    return (
        <ProductProvider product={item.product}>
            <ShoppingCartListItemContent item={item} />
        </ProductProvider>
    );
};
