import { ProductProvider, useProductContext, useShoppingCartContext } from '@/contexts';
import { ShoppingCartItem } from '@/types';
import { capitalize, formatPrice } from '@/utils/helpers';
import { Minus, Plus, X } from '@tamagui/lucide-icons';
import React from 'react';
import { Button, H4, SizableText, Theme, XStack, YStack } from 'tamagui';

interface ShoppingCartListItemProps {
    item: ShoppingCartItem;
}

const ShoppingCartListItemContent = ({ item }: ShoppingCartListItemProps) => {
    const { increaseQuantity, decreaseQuantity, removeItem } = useShoppingCartContext();
    const { product } = useProductContext();
    const { purchasable, quantity, price } = item;
    const { productVariation } = purchasable;

    return (
        <Theme name="light">
            <YStack gap="$3" padding="$3" borderBottomWidth={1} borderColor="$gray5">
                {/* Row 1: Product name + unit price */}
                <XStack ai="center" gap="$2">
                    <SizableText fontSize="$5" fontWeight="bold">
                        {product.name}
                        {productVariation && ` - ${capitalize(productVariation.name)}`}
                    </SizableText>
                    <SizableText fontSize="$4" color="$gray10">
                        {formatPrice(price)}
                    </SizableText>

                </XStack>

                {/* Row 2: Quantity + Subtotal + Remove */}
                <XStack jc="space-between" ai="center" gap="$4" theme="secondary">
                    {/* Quantity Controls */}
                    <XStack ai="center" gap="$2">
                        <Button
                            icon={<Minus size="$4" />}
                            onPress={() => decreaseQuantity(purchasable, { silent: true })}
                            size="$5"
                            circular
                            theme="accent"
                        />
                        <H4 width={30} textAlign="center">
                            {quantity}
                        </H4>
                        <Button
                            icon={<Plus size="$4" />}
                            onPress={() => increaseQuantity(purchasable, { silent: true })}
                            size="$5"
                            circular
                            theme="accent"
                        />
                    </XStack>

                    {/* Subtotal */}
                    <SizableText fontSize="$6" fontWeight="bold" flex={1} textAlign="right">
                        {formatPrice(quantity * price)}
                    </SizableText>
                    {/* Remove Button */}
                    <Button
                        icon={<X size="$4" />}
                        onPress={() => removeItem(purchasable, { silent: true })}
                        size="$5"
                        circular
                        theme="secondary"
                    />

                </XStack>
            </YStack>
        </Theme>
    );


};

export const ShoppingCartListItem = ({ item }: ShoppingCartListItemProps) => {
    return (
        <ProductProvider product={item.purchasable.product} productVariation={item.purchasable.productVariation}>
            <ShoppingCartListItemContent item={item} />
        </ProductProvider>
    );
};
