import { useLayoutContext } from "@/contexts/LayoutContext";
import { Toast, useToastState } from "@tamagui/toast";
import React, { useEffect, useState } from "react";
export const AppToast = () => {
    const currentToast = useToastState() // 👈 pulls the active toast being shown

    const { headerHeight } = useLayoutContext();
    const [toastQueue, setToastQueue] = useState<any[]>([])

    // Add new toasts to queue
    useEffect(() => {
        if (!currentToast || !currentToast.id || currentToast.hide) return

        setToastQueue((prev) => {
            // Avoid duplicate by ID
            if (prev.find((t) => t.id === currentToast.id)) return prev
            return [...prev, currentToast]
        })
    }, [currentToast])

    // Cleanup hidden toasts
    useEffect(() => {
        if (!currentToast?.hide) return

        setToastQueue((prev) => prev.filter((t) => t.id !== currentToast.id))
    }, [currentToast?.hide])

    if (toastQueue.length === 0) return null

    return <>
        {toastQueue.map((toast) => (
            <Toast
                key={toast.id}
                animation="quick"
                enterStyle={{ x: -20, opacity: 0 }}
                exitStyle={{ x: -20, opacity: 0 }}
                opacity={1}
                x={0}
                theme="green"
                borderWidth={1}
                borderColor="$green8"
                borderRadius="$4"
            >
                <Toast.Title>{toast?.title}</Toast.Title>
                <Toast.Description>{toast?.message}</Toast.Description>
            </Toast>
        ))}
    </>
}