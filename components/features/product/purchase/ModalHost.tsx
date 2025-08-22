// ModalHost.tsx
import { ThemedLinearGradient } from '@/components/ui';
import React from 'react';
import { Sheet, YStack, Adapt, Dialog } from 'tamagui';

import { THEME_SHEET, THEME_SHEET_BG1, THEME_SHEET_BG2 } from '@/config/app';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { setModalPosition, useModalStore } from '@/stores/modalStore';
import { useShallow } from 'zustand/react/shallow';
import { useModalSettled } from '@/hooks/useModalSettled';
export const ModalHost = () => {

    // ...
    const {
        open,
        renderer,
        payload,
        snapPoints,
        position,
        closeModal,
    } = useModalStore(
        useShallow((s) => ({
            open: s.open,
            renderer: s.renderer,
            payload: s.payload,
            snapPoints: s.snapPoints,
            position: s.position,
            closeModal: s.closeModal,
        }))
    );

    const { isFullyClosed, onHostLayout } = useModalSettled();
    const body = isFullyClosed
        ? null
        : renderer?.(payload, { close: () => closeModal(), setPosition: setModalPosition })

    const insets = useSafeAreaInsets();

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
                        <ThemedLinearGradient />
                        <Adapt.Contents />
                    </Sheet.Frame>
                </Sheet>
            </Adapt>
            <Dialog.Content theme={THEME_SHEET}>
                <ThemedLinearGradient fromTheme={{ theme: THEME_SHEET_BG1 }} toTheme={{ theme: THEME_SHEET_BG2 }} />
                <YStack f={1} mih={0}>
                    {body}
                </YStack>
            </Dialog.Content>
        </Dialog>
    )
}
//               
