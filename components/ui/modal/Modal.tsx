import { THEME_MODAL } from "@/config/app";
import { ChevronDown } from "@tamagui/lucide-icons";
import React from "react";
import { H4, Sheet, Theme, ThemeName, XStack, YStack } from "tamagui";
import { ThemedButton, ThemedLinearGradient } from "../themed-components";

interface ModalProps {
    open: boolean;
    title: string;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
}

export const Modal = ({ open, title, onOpenChange, children }: ModalProps) => {
    const theme: ThemeName = THEME_MODAL;
    return React.useMemo(() => (
        <Theme name={theme}>
            <Sheet
                open={open}
                onOpenChange={onOpenChange}
                modal
                snapPointsMode="percent"
                snapPoints={[90]}
                dismissOnSnapToBottom
                forceRemoveScrollEnabled={true}
                unmountChildrenWhenHidden={true}
                animation="fast"
            >
                <Sheet.Overlay />
                <Sheet.Handle />
                <Sheet.Frame f={1}
                    minHeight={0}
                    p="$4"
                    gap="$3"
                >
                    <ThemedLinearGradient
                        fullscreen
                        strong
                    />
                    <ThemedButton
                        pos="absolute"
                        right="$2"
                        top="$2"
                        circular
                        onPress={() => onOpenChange(false)}
                    >
                        <ChevronDown />
                    </ThemedButton>
                    <XStack
                        ai="center"
                        jc="space-between"
                        gap="$2"
                    >
                        <H4
                            fs={1}
                            fow="bold"
                            m={0}
                        >
                            {title}
                        </H4>
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
    ), [open, title, children]);
};
