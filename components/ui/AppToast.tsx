import { Toast, useToastState } from "@tamagui/toast";
import React from "react";
export const AppToast = () => {
    const toast = useToastState() // 👈 pulls the active toast being shown

    if (!toast || toast.isHandledNatively || toast.hide) {
        return null;
    }

    return (
        <Toast
            key={toast.id}
            animation="lazy"
            enterStyle={{ x: -20, opacity: 0 }}
            exitStyle={{ x: -20, opacity: 0 }}
            opacity={1}
            x={0}
            theme={toast.theme ?? 'primary'}
            borderWidth={1}
            backgroundColor="$background"
            borderColor="$borderColor"
            borderRadius="$4"
        >
            <Toast.Title>{toast.title}</Toast.Title>
            <Toast.Description>{toast.message}</Toast.Description>
        </Toast>
    )
}