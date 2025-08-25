// ModalHost.tsx
import { ThemedLinearGradient, ThemedYStack } from '@/components/ui';
import React from 'react';
import { Sheet, Adapt, Dialog } from 'tamagui';

import { THEME_SHEET, THEME_SHEET_BG1, THEME_SHEET_BG2 } from '@/config/app';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { setModalPosition, useModalStore } from '@/stores/modalStore';
import { useShallow } from 'zustand/react/shallow';
import { useModalSettled } from '@/hooks/useModalSettled';
import { useBackHandler } from '@react-native-community/hooks'

export const ModalHost = () => {

    // ...
    const {
        open,
        renderer,
        payload,
        snapPoints,
        position,
        closeModal,
        status,
    } = useModalStore(
        useShallow((s) => ({
            open: s.open,
            renderer: s.renderer,
            payload: s.payload,
            snapPoints: s.snapPoints,
            position: s.position,
            closeModal: s.closeModal,
            status: s.status,
        }))
    );

    const { onHostLayout } = useModalSettled();
    const body = status === "closed"
        ? null
        : renderer?.(payload, { close: () => closeModal(), setPosition: setModalPosition })

    const insets = useSafeAreaInsets();

    useBackHandler(() => {
        closeModal();
        return true;
    });

    return (
        <Dialog open={open} onOpenChange={(o) => { if (!o) closeModal(); }}>
            {/* On native, always render as a bottom Sheet */}
            <Adapt platform="native">
                <Sheet
                    modal
                    snapPointsMode="percent"
                    snapPoints={snapPoints}         // e.g. [85]
                    position={position}
                    onPositionChange={setModalPosition}
                    unmountChildrenWhenHidden
                    dismissOnSnapToBottom
                    animation="fast"
                >
                    <Sheet.Overlay bg="black" opacity={0.15} />
                    <Sheet.Frame f={1} mih={0} p="$4" gap="$3" mb={insets.bottom} onLayout={onHostLayout}>
                        <ThemedLinearGradient pointerEvents="none" />
                        <Adapt.Contents />
                    </Sheet.Frame>
                </Sheet>
            </Adapt>
            <Dialog.Content theme={THEME_SHEET}>
                <ThemedLinearGradient fromTheme={{ theme: THEME_SHEET_BG1 }} toTheme={{ theme: THEME_SHEET_BG2 }} />
                <ThemedYStack f={1} mih={0}>
                    {body}
                </ThemedYStack>
            </Dialog.Content>
        </Dialog>
    )
}
//               
