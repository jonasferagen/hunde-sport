import { ThemedLinearGradient, ThemedXStack, ThemedYStack } from "@/components/ui";
import { Purchasable } from "@/types";
import React from "react";
import { ProductPrice, ProductStatus, ProductTitle, ProductVariationLabel } from "../display";


import { Button, Sheet, Spacer } from 'tamagui';
import { ProductVariationSelect } from "../product-variation/ProductVariationSelect";

import { PurchasableProvider, useCartContext, usePurchasableContext } from "@/contexts";
export const ProductVariationsModal = ({
    close,
    purchasable, // used only to seed the provider
}: {
    close: () => void
    purchasable: Purchasable
}) => {
    return (
        <PurchasableProvider purchasable={purchasable}>
            <Inner close={close} />
        </PurchasableProvider>
    )
}

const Inner = ({ close }: { close: () => void }) => {
    const { purchasable } = usePurchasableContext()
    const { addItem } = useCartContext();



    return (
        <ThemedYStack f={1} mih={0}>
            <ThemedYStack>
                <ProductTitle />
            </ThemedYStack>

            <Sheet.ScrollView f={1} mih={0}>
                <ThemedLinearGradient />
                <ProductVariationSelect />
            </Sheet.ScrollView>

            <ThemedYStack>
                <ProductVariationLabel />
                <ThemedXStack split>
                    <ProductStatus />
                    <ProductPrice />
                </ThemedXStack>
            </ThemedYStack>

            <ThemedYStack gap="$3" f={0} mb="$5">

                <Button disabled={!purchasable.isValid} onPress={() => { addItem(purchasable); close() }}>
                    Neste
                </Button>
            </ThemedYStack>

            <Spacer mb="$6" />
        </ThemedYStack>
    )
}

