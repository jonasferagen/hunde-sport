import { useLayoutContext } from "@/contexts/LayoutContext";
import { Toast, useToastState } from "@tamagui/toast";
import React from "react";
import { YStack } from "tamagui";
export const AppToast = () => {
    const toastState = useToastState() // 👈 pulls the active toast being shown
    const { headerHeight } = useLayoutContext();
    if (!toastState) return null // No toast to show

    return (
        <YStack ai="center">

            <Toast
                key={toastState.id}
                animation={toastState.animation}
                enterStyle={{ x: -20, opacity: 0 }}
                exitStyle={{ x: -20, opacity: 0 }}
                opacity={1}
                x={0}
                y={headerHeight}
                theme="green"
                borderWidth={1}
                borderColor="$green8"
                borderRadius="$4"
            >
                <Toast.Title>{toastState.title}</Toast.Title>
                <Toast.Description>{toastState.message}</Toast.Description>
            </Toast>

        </YStack>
    )
}