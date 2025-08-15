import { ThemedButton, ThemedXStack, ThemedYStack } from "@/components/ui";
import { Purchasable } from "@/types";
import React from "react";
import { ProductImage, ProductPrice, ProductStatus, ProductTitle, ProductVariationLabel } from "../display";


import { Sheet, YStack } from 'tamagui';
import { ProductVariationSelect } from "../product-variation/ProductVariationSelect";

import { PurchasableProvider, useCartContext, usePurchasableContext } from "@/contexts";
import { ChevronDown } from "@tamagui/lucide-icons";
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
        <ThemedYStack f={1} mih={0} >
            <ThemedXStack split>
                <ProductTitle fs={1} />
                <ThemedButton circular onPress={close}>
                    <ChevronDown />
                </ThemedButton>
            </ThemedXStack>
            <ProductImage img_height={200} />

            <Sheet.ScrollView f={1} mih={0}>
                <YStack pb="$4">
                    <ProductVariationSelect />
                </YStack>
            </Sheet.ScrollView>

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

        </ThemedYStack>
    )
}

