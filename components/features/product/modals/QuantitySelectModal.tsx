import { ThemedButton, ThemedText } from "@/components/ui";
import { usePurchasableContext } from "@/contexts";
import { useCartContext } from "@/contexts/CartContext";
import { Purchasable } from "@/types";
import { Minus, Plus } from "@tamagui/lucide-icons";
import React, { JSX } from "react";
import { XStack } from "tamagui";
import { PurchaseWizardStep } from "./PurchaseWizard";



export const QuantitySelectModal = ({
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
