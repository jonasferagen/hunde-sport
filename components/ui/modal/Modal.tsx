import React from "react";
import { Dimensions } from "react-native";
import { Sheet, YStack } from "tamagui";

interface ModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
}

export const Modal = ({ open, onOpenChange, children }: ModalProps) => {
    const [contentHeight, setContentHeight] = React.useState(0);
    const screenHeight = Dimensions.get("window").height;
    const desiredHeight = Math.min(contentHeight + 80, screenHeight * 0.9);
    const snapPointPercent = Math.min(
        100,
        (desiredHeight / screenHeight) * 100
    );

    return (
        <Sheet
            open={open}
            onOpenChange={onOpenChange}
            modal
            snapPointsMode="percent"
            snapPoints={[snapPointPercent]}
            dismissOnSnapToBottom
        >
            <Sheet.Overlay />
            <Sheet.Handle />
            <Sheet.Frame f={1} minHeight={0} p="$4" gap="$4">
                <YStack
                    f={1}
                    minHeight={0}
                    onLayout={(e) => setContentHeight(e.nativeEvent.layout.height)}
                >
                    {children}
                </YStack>
            </Sheet.Frame>
        </Sheet>
    );
};
