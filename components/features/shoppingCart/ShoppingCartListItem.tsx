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
        <Theme name="secondary">
            <YStack gap="$2" padding="$3">
                <XStack ai="center" jc="space-between" gap="$2">
                    <SizableText size="$5" fontWeight="bold">{product.name} {productVariation && `${capitalize(productVariation.name)}`}</SizableText>
                    <SizableText size="$5" fontWeight="bold">{formatPrice(price)}</SizableText>
                </XStack>
                <XStack gap="$3" flex={1} ai="center">
                    <Button
                        theme="secondary"
                        icon={<X size="$4" />}
                        onPress={() => removeItem(purchasable, { silent: true })}
                        size="$6"
                        circular
                    />

                    <XStack ai="center" gap="$2" flex={1}>
                        <SizableText fontWeight="bold">{formatPrice(quantity * price)}</SizableText>
                    </XStack>
                    <XStack ai="center" gap="$1" theme="secondary">
                        <H4 width={30} textAlign="center" theme="light">
                            {quantity}
                        </H4>
                        <Button
                            theme="accent"
                            icon={<Minus size="$4" />}
                            onPress={() => decreaseQuantity(purchasable, { silent: true })}
                            size="$6"
                            circular
                        />

                        <Button
                            theme="accent"
                            icon={<Plus size="$4" />}
                            onPress={() => increaseQuantity(purchasable, { silent: true })}
                            size="$6"
                            circular
                        />
                    </XStack>
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
