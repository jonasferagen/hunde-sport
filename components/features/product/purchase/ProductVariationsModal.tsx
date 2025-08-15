import { ThemedXStack, ThemedYStack } from "@/components/ui";
import { Purchasable } from "@/types";
import React from "react";
import { ProductPrice, ProductStatus, ProductTitle, ProductVariationLabel } from "../display";


import { Spacer } from 'tamagui';
import { ProductVariationSelect } from "../product-variation/ProductVariationSelect";

import { PurchasableProvider, useCartContext, usePurchasableContext } from "@/contexts";
import { PurchaseButton } from "./PurchaseButton";
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

    const [isLoading, setIsLoading] = React.useState(false);

    const onPress = async () => {
        setIsLoading(true);
        await addItem(purchasable);
        setIsLoading(false);
        close();
    }

    return (
        <ThemedYStack f={1} mih={0}>
            <ThemedYStack>
                <ProductTitle />
            </ThemedYStack>

            <ProductVariationSelect />

            <ThemedYStack>
                <ProductVariationLabel />
                <ThemedXStack split>
                    <ProductStatus />
                    <ProductPrice />
                </ThemedXStack>
            </ThemedYStack>

            <ThemedYStack gap="$3" f={0} mb="$5">
                <PurchaseButton onPress={onPress} enable={purchasable.isValid} isLoading={isLoading} />
            </ThemedYStack>

            <Spacer mb="$6" />
        </ThemedYStack>
    )
}

/*          <Sheet.ScrollView f={1} mih={0} >
                <ProductVariationSelect />
            </Sheet.ScrollView> */