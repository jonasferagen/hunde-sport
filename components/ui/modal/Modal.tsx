import { ThemedButton } from "@/components/ui/themed-components/ThemedButton";
import { X } from "@tamagui/lucide-icons";
import React from "react";
import { H4, Sheet, Theme, XStack, YStack, useThemeName } from "tamagui";

interface ModalProps {
    open: boolean;
    title: string;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
}

export const Modal = ({ open, title, onOpenChange, children }: ModalProps) => {
    const themeName = useThemeName();

    return (
        <Theme name={themeName}>
            <Sheet
                open={open}
                onOpenChange={onOpenChange}
                modal
                snapPointsMode="percent"
                snapPoints={[90]}
                dismissOnSnapToBottom
            >
                <Sheet.Overlay />
                <Sheet.Handle />
                <Sheet.Frame f={1} minHeight={0} p="$4" gap="$4">
                    <XStack ai="center" jc="space-between" gap="$4">
                        <H4 fs={1}>{title}</H4>
                        <ThemedButton
                            circular
                            onPress={() => onOpenChange(false)}
                        >
                            <X />
                        </ThemedButton>
                    </XStack>
                    <YStack
                        f={1}
                        minHeight={0}

                    >
                        {children}
                    </YStack>
                </Sheet.Frame>
            </Sheet>
        </Theme>
    );
};
