import product from '@/app/(app)/product';
import { ThemedStackProps, ThemedXStack, ThemedYStack } from '@/components/ui/ThemedStack';
import { ProductProvider } from '@/contexts';
import { Purchasable } from '@/types';
import React, { useState } from 'react';
import { Sheet, YStack } from 'tamagui';
import { PurchaseButton } from '../display/PurchaseButton';
import { ProductVariations } from '../product-variation/ProductVariations';



export const ProductCardFooter = ({ purchasable, stackProps }: { purchasable: Purchasable; stackProps?: ThemedStackProps }) => {
    const [sheetOpen, setSheetOpen] = useState(false);


    return (
        <ThemedYStack p="none" {...stackProps}>
            {purchasable.product.type === "variable" && (
                <ThemedXStack gap="$2" theme="soft">
                    <ProductVariations />
                </ThemedXStack>
            )}
            <ThemedYStack>
                {purchasable.activeProduct.availability.isInStock && <PurchaseButton boc="black" bw={1} />}
            </ThemedYStack>
        </ThemedYStack>
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