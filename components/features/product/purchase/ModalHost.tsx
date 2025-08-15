// ModalHost.tsx
import { ThemedLinearGradient } from '@/components/ui';
import React from 'react';
import { Sheet, Theme, YStack } from 'tamagui';

import { closeModal, setModalPosition, useModalStore } from './ModalStore';


export const ModalHost = () => {
    const { open, renderer, payload, snapPoints, position } = useModalStore()

    return (
        <Theme name="secondary">
            <Sheet
                modal
                native
                open={open}
                onOpenChange={(o: boolean) => {
                    if (!o) closeModal()
                }}
                snapPointsMode="percent"
                snapPoints={snapPoints}
                position={position}
                onPositionChange={(p) => setModalPosition(p)}
                unmountChildrenWhenHidden
                dismissOnSnapToBottom
                animation="fast"
            >
                <Sheet.Overlay bg="white" opacity={0.2} />
                <Sheet.Frame f={1} mih={0} p="$4" gap="$3">
                    <ThemedLinearGradient />
                    <YStack f={1} mih={0}>
                        {renderer ? renderer({ close: closeModal, setPosition: setModalPosition }) : null}
                    </YStack>
                </Sheet.Frame>
            </Sheet>
        </Theme>
    )
}
//               
