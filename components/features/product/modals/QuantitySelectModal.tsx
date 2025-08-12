import { ThemedButton, ThemedText, ThemedXStack, ThemedYStack } from "@/components/ui";
import { usePurchasableContext } from "@/contexts";
import { useCartContext } from "@/contexts/CartContext";
import { Minus, Plus } from "@tamagui/lucide-icons";
import React, { JSX } from "react";
import { Theme, XStack, YStack } from "tamagui";
import { BackButton } from "./BackButton";
import { NextButton } from "./NextButton";



export const QuantitySelectModal = ({ onNext, onBack }: { onNext: () => void, onBack?: () => void }): JSX.Element => {

    const { addItem } = useCartContext();
    const { purchasable } = usePurchasableContext();
    const [quantity, setQuantity] = React.useState(1);


    const onPress = () => {
        addItem(
            purchasable,
            quantity
        );
        onNext();
    };

    return (
        <Theme name="soft">
            <ThemedYStack my="$4">
                <ThemedXStack
                    ai="center"
                    jc="space-between"
                >
                    {onBack && <BackButton onPress={onBack} disabled={false} />}
                </ThemedXStack>
                <YStack>
                    <XStack
                        ai="center"
                        jc="center"
                        gap="$3"
                        p="$4"
                    >
                        <ThemedButton
                            circular
                            onPress={() => setQuantity(q => Math.max(1, q - 1))}
                        >
                            <Minus />
                        </ThemedButton>
                        <ThemedText
                            fos="$6"
                            ta="center"
                            minWidth={30}
                        >
                            {quantity}
                        </ThemedText>
                        <ThemedButton
                            circular
                            onPress={() => setQuantity(q => q + 1)}
                        >
                            <Plus />
                        </ThemedButton>
                    </XStack>
                </YStack>
                <ThemedYStack my="$4">
                    <NextButton
                        onPress={onPress}
                        disabled={!purchasable.isValid}
                    />
                </ThemedYStack>
            </ThemedYStack>
        </Theme>
    );
}

