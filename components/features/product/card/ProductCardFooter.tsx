import { ThemedStackProps, ThemedXStack, ThemedYStack } from '@/components/ui/ThemedStack';
import { ProductProvider } from '@/contexts';
import { Purchasable } from '@/types';
import React, { useState } from 'react';
import { Sheet } from 'tamagui';
import { PurchaseButton } from '../display/PurchaseButton';
import { VariationButton } from '../display/VariationButton';
import { ProductVariations } from '../product-variation/ProductVariations';



export const ProductCardFooter = ({ purchasable, stackProps }: { purchasable: Purchasable; stackProps?: ThemedStackProps }) => {
    const [sheetOpen, setSheetOpen] = useState(false);


    return (
        <ThemedYStack p="none" {...stackProps}>

            {purchasable.product.type === "variable" && (
                <>
                    <ProductVariations />
                    <VariationButton onPress={() => setSheetOpen(true)} />
                    <Sheet
                        open={sheetOpen}
                        onOpenChange={setSheetOpen}
                        modal
                        dismissOnSnapToBottom
                    >
                        <Sheet.Overlay />
                        <Sheet.Handle />
                        <Sheet.Frame f={1} p="$4"
                            jc="center"
                            ai="center"
                            gap="$4"
                            boc="black"
                            bw={1}>
                            <ThemedXStack gap="$2" theme="soft">
                                <ProductProvider product={purchasable.product}>
                                    <ProductVariations />
                                </ProductProvider>
                            </ThemedXStack>
                        </Sheet.Frame>
                    </Sheet>
                </>
            )}

            <ThemedYStack>
                {purchasable.activeProduct.availability.isInStock && <PurchaseButton boc="black" bw={1} />}
            </ThemedYStack>
        </ThemedYStack>
    );
}


