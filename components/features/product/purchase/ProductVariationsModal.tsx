import { ThemedButton, ThemedXStack, ThemedYStack } from "@/components/ui";
import { Purchasable } from "@/types";
import React, { useState } from "react";
import { ProductImage, ProductPrice, ProductStatus, ProductTitle, ProductVariationLabel } from "../display";


import { Sheet, YStack } from 'tamagui';
import { ProductVariationSelect } from "../product-variation/ProductVariationSelect";

import { PurchasableProvider, usePurchasableContext } from "@/contexts/PurchasableContext";
import { useAddToCart } from "@/hooks/useAddToCart";
import { ChevronDown } from "@tamagui/lucide-icons";
import { derivePurchaseCTA, PurchaseButton } from "./PurchaseButton";
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
    const addToCart = useAddToCart();
    const { purchasable } = usePurchasableContext()
    const [loading, setLoading] = useState(false)

    const cta = derivePurchaseCTA(purchasable);

    const onPress = async () => {
        setLoading(true);
        try {
            await addToCart(purchasable);
            close();
        } finally {
            setLoading(false);
        }
    };

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
                <PurchaseButton cta={cta} onPress={onPress} isLoading={loading} />
            </ThemedYStack>
        </ThemedYStack>
    )
}

