import { ThemedButton, ThemedText } from "@/components/ui";
import { useCartContext } from "@/contexts";
import { Purchasable } from "@/types";
import { Minus, Plus } from "@tamagui/lucide-icons";
import React, { JSX } from "react";
import { XStack, YStack } from "tamagui";

interface QuantitySelectContentProps {
    purchasable: Purchasable;
    onPurchase: () => void;
}

export const QuantitySelectContent = ({ purchasable, onPurchase }: QuantitySelectContentProps): JSX.Element => {
    const { addItem } = useCartContext();
    const [qty, setQty] = React.useState(1);

    return <YStack>
        <XStack
            ai="center"
            jc="center"
            gap="$3"
            p="$4"
        >
            <ThemedButton
                circular
                onPress={() => setQty(q => Math.max(1, q - 1))}
            >
                <Minus />
            </ThemedButton>
            <ThemedText fos="$6">{qty}</ThemedText>
            <ThemedButton
                circular
                onPress={() => setQty(q => q + 1)}
            >
                <Plus />
            </ThemedButton>
        </XStack>
        <ThemedButton
            mt="$4"
            onPress={() => {
                addItem(purchasable, qty);
                onPurchase();
            }}
        >
            <ThemedText>Legg i handlekurv</ThemedText>
        </ThemedButton>
    </YStack>
};
