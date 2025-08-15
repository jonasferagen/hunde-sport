import { ThemedLinearGradient, ThemedXStack, ThemedYStack } from "@/components/ui";
import { Purchasable } from "@/types";
import React from "react";
import { ProductPrice, ProductStatus, ProductTitle, ProductVariationLabel } from "../display";


import { Button, Sheet, Spacer } from 'tamagui';
import { ProductVariationSelect } from "../product-variation/ProductVariationSelect";

import { PurchasableProvider } from "@/contexts";

export const ProductVariationsModal = ({
    onNext,
    onBack,
    purchasable,
}: {
    onNext: (purchasable: Purchasable) => void,
    onBack: (purchasable: Purchasable) => void,
    purchasable: Purchasable,

}) =>
    <PurchasableProvider purchasable={purchasable}>
        <ThemedYStack f={1} mih={0} >
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
                <Button onPress={() => onBack(purchasable)} disabled={!purchasable.isValid} theme="primary" >Tilbake</Button>
                <Button onPress={() => onNext(purchasable)} disabled={!purchasable.isValid} theme="primary" >Neste</Button>
            </ThemedYStack>
            <Spacer mb="$6">
            </Spacer>
        </ThemedYStack >
    </PurchasableProvider>
//  <ProductImage img_height={300} />
