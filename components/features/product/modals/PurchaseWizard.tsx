import { ThemedButton, ThemedLinearGradient, ThemedText, ThemedXStack, ThemedYStack } from "@/components/ui";
import { Purchasable } from "@/types";
import React, { JSX } from "react";
import { ProductPrice, ProductStatus, ProductTitle, ProductVariationLabel } from "../display";
import { BackButton } from "./BackButton";
import { NextButton } from "./NextButton";

import { useCartContext, usePurchasableContext } from "@/contexts";
import { Minus, Plus } from "@tamagui/lucide-icons";
import { Sheet, XStack } from 'tamagui';
import { ProductVariationSelect } from "../product-variation/ProductVariationSelect";



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
    <ThemedYStack f={1} mih={0} >
        <ThemedYStack>
            <ProductTitle />
        </ThemedYStack>
        <Sheet.ScrollView f={1} mih={0}>
            {children}
        </Sheet.ScrollView>
        <ThemedYStack>
            <ProductVariationLabel />
            <ThemedXStack ai="center" jc="space-between">
                <ProductStatus />
                <ProductPrice />
            </ThemedXStack>
        </ThemedYStack>
        <ThemedYStack gap="$3" f={0}>

            <NextButton
                onPress={() => onNext(purchasable)}
                disabled={!purchasable.isValid}
            />
            <BackButton
                onPress={() => onBack(purchasable)}
                disabled={false}
            />
        </ThemedYStack>
    </ThemedYStack >



const ProductVariationsModal = ({
    onNext,
    onBack,
}: {
    onNext: (purchasable: Purchasable) => void,
    onBack: (purchasable: Purchasable) => void
}) => {

    const { purchasable } = usePurchasableContext();

    return (
        <PurchaseWizardStep
            onNext={onNext}
            onBack={onBack}
            purchasable={purchasable}
        >
            <>
                <ThemedLinearGradient />
                <ProductVariationSelect />
            </>
        </PurchaseWizardStep>

    );
}

const QuantitySelectModal = ({
    onNext,
    onBack
}: {
    onNext: (purchasable: Purchasable) => void,
    onBack: (purchasable: Purchasable) => void
}): JSX.Element => {

    const { addItem } = useCartContext();
    const { purchasable } = usePurchasableContext();
    const [quantity, setQuantity] = React.useState(1);

    const onPress = () => {
        addItem(
            purchasable,
            quantity
        );
        onNext(purchasable);
    };

    return (
        <PurchaseWizardStep
            onNext={onPress}
            onBack={onBack}
            purchasable={purchasable}
        >
            <XStack ai="center" jc="center" gap="$3" p="$4">
                <ThemedButton circular onPress={() => setQuantity(q => Math.max(1, q - 1))}>
                    <Minus />
                </ThemedButton>
                <ThemedText fos="$6" ta="center" minWidth={30}>
                    {quantity}
                </ThemedText>
                <ThemedButton circular onPress={() => setQuantity(q => q + 1)}>
                    <Plus />
                </ThemedButton>
            </XStack>
        </PurchaseWizardStep>
    )
}
