// ModalHost.tsx
import { ThemedLinearGradient } from '@/components/ui';
import React from 'react';
import { Sheet, Theme, YStack } from 'tamagui';

import { THEME_MODAL } from '@/config/app';
import { useSheetSettled } from '@/hooks/useSheetSettled';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Adapt, Dialog } from 'tamagui';
import { setModalPosition, useModalStore } from '../../../../stores/modalStore';

export const ModalHost = () => {

    const insets = useSafeAreaInsets();

    const { open, closeModal, renderer, payload, snapPoints, position } = useModalStore()

    const { isFullyOpen } = useSheetSettled({ open, position });

    const body = isFullyOpen
        ? renderer?.(payload, { close: () => closeModal(), setPosition: setModalPosition })
        : null;


    return (
        <Theme name={THEME_MODAL}>
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
                        <Sheet.Frame f={1} mih={0} p="$4" gap="$3" mb={insets.bottom}>
                            <ThemedLinearGradient />
                            <Adapt.Contents />
                        </Sheet.Frame>
                    </Sheet>
                </Adapt>
                <Dialog.Content>
                    <YStack f={1} mih={0}>
                        {body}
                    </YStack>
                </Dialog.Content>
            </Dialog>
        </Theme>
    )
}
//               
