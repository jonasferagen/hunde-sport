import { ProductProvider, useShoppingCartContext } from '@/contexts';
import { ShoppingCartItem } from '@/types';
import { formatPrice } from '@/utils/helpers';
import { Minus, Plus, X } from '@tamagui/lucide-icons';
import React from 'react';
import { Button, SizableText, Theme, XStack } from 'tamagui';

interface ShoppingCartListItemProps {
    item: ShoppingCartItem;
}

const ShoppingCartListItemContent = ({ item }: ShoppingCartListItemProps) => {
    const { increaseQuantity, decreaseQuantity, removeItem } = useShoppingCartContext();
    const { purchasable, quantity } = item;
    const { product, productVariation } = purchasable;
    const activeProduct = productVariation || product;

    return (
        <Theme name="secondary">
            <XStack gap="$3" flex={1} padding="$3">
                <XStack ai="center" jc="space-between">
                    <Button
                        theme="secondary"
                        icon={<X />}
                        onPress={() => removeItem(purchasable, { silent: true })}
                        size="$6"
                        circular
                    />
                </XStack>
                <XStack ai="center" gap="$2" flex={1}>
                    <SizableText fontSize="$6" fontWeight="bold">{productVariation?.name}</SizableText>
                    <SizableText fontSize="$6" fontWeight="bold">{formatPrice(activeProduct.price)}</SizableText>
                </XStack>
                <XStack ai="center" jc="space-between">
                    <XStack ai="center" gap="$1" theme="secondary">
                        <SizableText fontSize="$6" width={30} textAlign="center" theme="light">
                            {quantity}
                        </SizableText>
                        <SizableText fontSize="$6" fontWeight="bold">{formatPrice(activeProduct.price * quantity)}</SizableText>
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
            </XStack>
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
