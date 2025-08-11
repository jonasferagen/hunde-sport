import { ThemedButton, ThemedText, ThemedYStack } from "@/components/ui";
import { THEME_MODAL_QUANTITY_SELECT } from "@/config/app";
import { useModalContext } from "@/contexts";
import { useCartContext } from "@/contexts/CartContext";
import { Minus, Plus } from "@tamagui/lucide-icons";
import React, { JSX } from "react";
import { Stack, Theme, ThemeName, XStack, YStack } from "tamagui";
import { ContinueButton } from "./ContinueButton";



export const QuantitySelectContent = (): JSX.Element => {
    const { addItem } = useCartContext();

    const { toggleModal, purchasable } = useModalContext();
    const [quantity, setQuantity] = React.useState(1);

    if (!purchasable) throw new Error("No purchasable");


    const onPress = () => {
        addItem(
            purchasable,
            quantity
        );
        toggleModal();
    };

    const theme: ThemeName = THEME_MODAL_QUANTITY_SELECT;

    return (
        <><Theme name={theme}>
            <Stack>

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
                        <ThemedText fos="$6" ta="center" minWidth={30}>{quantity}</ThemedText>
                        <ThemedButton
                            circular
                            onPress={() => setQuantity(q => q + 1)}
                        >
                            <Plus />
                        </ThemedButton>
                    </XStack>
                </YStack>
                <ThemedYStack >
                    <ContinueButton
                        onPress={onPress}
                        disabled={!purchasable.isValid}
                    />
                </ThemedYStack>
            </Stack>
        </Theme>
        </>)

};

