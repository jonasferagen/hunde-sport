import React from "react";
import { Sheet, YStack } from "tamagui";

interface ModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
}

export const Modal = ({ open, onOpenChange, children }: ModalProps) => {

    return (
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
                <YStack
                    f={1}
                    minHeight={0}
                >
                    {children}
                </YStack>
            </Sheet.Frame>
        </Sheet>
    );
};
