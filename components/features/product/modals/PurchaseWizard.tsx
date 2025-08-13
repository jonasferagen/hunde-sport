import { ThemedXStack, ThemedYStack } from "@/components/ui";
import { Purchasable } from "@/types";
import React, { JSX } from "react";
import { ProductPrice, ProductStatus, ProductTitle, ProductVariationLabel } from "../display";
import { BackButton } from "./BackButton";
import { NextButton } from "./NextButton";
import { ProductVariationsModal } from "./ProductVariationsModal";
import { QuantitySelectModal } from "./QuantitySelectModal";

import { ScrollView } from 'tamagui';



type PWProps = {
    close: () => void;
    payload: Purchasable;
    updatePayload: (p: Purchasable) => void;
};

export const PurchaseWizard = ({ close, payload, updatePayload }: PWProps) => {

    const [step, setStep] = React.useState(payload.isVariable ? 0 : 1);

    // Step 0: Variations
    if (step === 0) {
        return (
            <ProductVariationsModal
                onNext={(next) => {
                    updatePayload(next); // update host/context
                    setStep(1);          // advance to quantity
                }}
                onBack={close}
            />
        );
    }
    // Step 1: Quantity
    return (
        <QuantitySelectModal
            onNext={close}
            onBack={payload.isVariable ? () => setStep(0) : close}
        />
    );
}



export const PurchaseWizardStep = ({
    onNext,
    onBack,
    purchasable,
    children }: {
        onNext: (purchasable: Purchasable) => void,
        onBack: (purchasable: Purchasable) => void,
        purchasable: Purchasable,
        children: JSX.Element
    }) =>
    <ThemedYStack f={1} h="100%" >
        <ThemedYStack>
            <ProductTitle />
        </ThemedYStack>
        <ScrollView h="100%" fs={1}>
            {children}
        </ScrollView>
        <ThemedYStack>
            <ProductVariationLabel />
            <ThemedXStack ai="center" jc="space-between">
                <ProductStatus />
                <ProductPrice />
            </ThemedXStack>
        </ThemedYStack>
        <ThemedYStack>
            <BackButton
                onPress={() => onBack(purchasable)}
                disabled={false}
            />
            <NextButton
                onPress={() => onNext(purchasable)}
                disabled={!purchasable.isValid}
            />
        </ThemedYStack>
    </ThemedYStack>


