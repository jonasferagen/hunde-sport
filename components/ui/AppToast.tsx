import { Toast, useToastState } from "@tamagui/toast";
import React from "react";
export const AppToast = () => {
    const toast = useToastState() // 👈 pulls the active toast being shown


    if (!toast || toast.isHandledNatively) {
        return null;
    }

    return <Toast
        key={toast.id}
        animation="bouncy"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
        opacity={1}

        theme={toast.theme ?? 'primary'}
        borderWidth={1}
        backgroundColor="$background"
        borderColor="$borderColor"
        borderRadius="$4"
    >
        <Toast.Title>{toast.title}</Toast.Title>
        <Toast.Description>{toast.message}</Toast.Description>
    </Toast>

}