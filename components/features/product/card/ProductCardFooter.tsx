import { ProductProvider, useProductContext } from '@/contexts';
import React, { useState } from 'react';
import { Sheet, StackProps, XStack, YStack } from 'tamagui';
import { ProductStatus } from '../display/ProductStatus';
import { ProductTitle } from '../display/ProductTitle';
import { PurchaseButton } from '../display/PurchaseButton';
import { VariationButton } from '../display/VariationButton';
import { ProductVariations } from '../product-variation/ProductVariations';

interface ProductCardFooterProps extends StackProps { }

export const ProductCardFooter = (props: ProductCardFooterProps) => {
    const { product, purchasable } = useProductContext();
    const [sheetOpen, setSheetOpen] = useState(false);

    return (
        <>
            <YStack p="$3" mt="$2" gap="$2" {...props} f={1} fg={1}>
                {purchasable.product.type === "variable" &&
                    <VariationButton onPress={() => setSheetOpen(true)} />
                }
            </YStack>
            <Sheet
                open={sheetOpen}
                onOpenChange={setSheetOpen}
                modal
                dismissOnSnapToBottom
            >
                <Sheet.Overlay />
                <Sheet.Handle />
                <Sheet.Frame f={1} p="$4" jc="center" ai="center" gap="$4">
                    <ProductProvider product={product}>
                        <YStack gap="$2" theme="secondary_soft" w="100%">
                            <ProductVariations />
                        </YStack>
                    </ProductProvider>
                </Sheet.Frame>
            </Sheet>
            {purchasable.product.type === "variable" &&
                <YStack mx="none">
                    <YStack p="$3" f={1}>
                        <XStack ai="center" gap="$2" f={1} p="$2">
                            <ProductTitle variation />
                            <ProductStatus />
                        </XStack>
                        <PurchaseButton />
                    </YStack>
                </YStack>
            }
        </>
    );
}