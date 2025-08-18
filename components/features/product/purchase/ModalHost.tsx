// ModalHost.tsx
import { ThemedLinearGradient } from '@/components/ui';
import React from 'react';
import { Sheet, Theme, YStack } from 'tamagui';

import { THEME_MODAL } from '@/config/app';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { setModalPosition, useModalStore } from '../../../../stores/modalStore';

export const ModalHost = () => {

    const insets = useSafeAreaInsets();

    const { open, closeModal, renderer, payload, snapPoints, position } = useModalStore()

    return (
        <Theme name={THEME_MODAL}>
            <Sheet
                modal
                native
                open={open}
                onOpenChange={(o: boolean) => { if (!o) closeModal(); }}
                snapPointsMode="percent"
                snapPoints={snapPoints}         // e.g. [85]
                position={position}
                onPositionChange={setModalPosition}
                unmountChildrenWhenHidden
                dismissOnSnapToBottom
                animation="fast"
            >
                <Sheet.Overlay bg="black" opacity={0.15} />
                <Sheet.Frame f={1} mih={0} p="$4" gap="$3" mb={insets.bottom}>
                    <ThemedLinearGradient />
                    <YStack f={1} mih={0}>
                        {renderer
                            ? renderer(payload, {
                                close: () => closeModal(),
                                setPosition: setModalPosition,
                            })
                            : null}
                    </YStack>
                </Sheet.Frame>
            </Sheet>
        </Theme>
    )
}
//               
