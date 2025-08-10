import product from '@/app/(app)/product';
import { ProductProvider, useProductContext } from '@/contexts';
import React, { useState } from 'react';
import { Sheet, StackProps, XStack, YStack } from 'tamagui';
import { ProductStatus } from '../display/ProductStatus';
import { ProductTitle } from '../display/ProductTitle';
import { PurchaseButton } from '../display/PurchaseButton';
import { ProductVariations } from '../product-variation/ProductVariations';

interface ProductCardFooterProps extends StackProps { }

export const ProductCardFooter = (props: ProductCardFooterProps) => {
    const { product, purchasable } = useProductContext();
    const [sheetOpen, setSheetOpen] = useState(false);
    const { availability } = purchasable;

    return (
        <YStack gap="$3" p="$3">
            <XStack ai="center" gap="$2" f={1} >
                <ProductTitle product={product} />
                <ProductStatus />
            </XStack>

            <XStack gap="$2" theme="soft">
                <ProductVariations />
            </XStack>

            <YStack>
                {availability.isInStock && <PurchaseButton boc="black" bw={1} />}
            </YStack>
        </YStack>
    );
}

/* 
            <YStack p="$3" mt="$2" gap="$2" {...props} f={1} fg={1}>
                {purchasable.product.type === "variable" &&
                    <VariationButton onPress={() => setSheetOpen(true)} />
                }
            </YStack>
*/

const VariationsSheet = () => {
    return (
        <Sheet
            open={sheetOpen}
            onOpenChange={setSheetOpen}
            modal
            dismissOnSnapToBottom
        >
            <Sheet.Overlay />
            <Sheet.Handle />
            <Sheet.Frame f={1} p="$4" jc="center" ai="center" gap="$4" boc="black" bw={1}>
                <ProductProvider product={product}>
                    <YStack gap="$2" theme="soft" w="100%" boc="black" bw={1}>
                        <ProductVariations />
                    </YStack>
                </ProductProvider>
            </Sheet.Frame>
        </Sheet>
    );
}