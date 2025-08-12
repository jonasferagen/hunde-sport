// ModalHost.tsx
import { ThemedButton } from '@/components/ui/themed-components';
import { PurchasableProvider } from '@/contexts';
import { useModalStore } from '@/stores/modalStore';
import { ChevronDown } from '@tamagui/lucide-icons';
import React from 'react';
import { H4, Sheet, XStack, YStack } from 'tamagui';

export const ModalHost = () => {
    const { open, render, payload, closeModal } = useModalStore();

    return (
        <Sheet
            modal={false}
            open={open}
            onOpenChange={(o: boolean) => !o && closeModal()}
            snapPointsMode="percent"
            snapPoints={[90]}
            unmountChildrenWhenHidden
            animation="fast"
        >
            <Sheet.Overlay />
            <Sheet.Frame f={1} minHeight={0} p="$4" gap="$3">

                <ThemedButton
                    pos="absolute"
                    right="$2"
                    top="$2"
                    circular
                    onPress={() => closeModal()}
                >
                    <ChevronDown />
                </ThemedButton>
                <XStack
                    ai="center"
                    jc="space-between"
                    gap="$2"
                >
                    <H4
                        fs={1}
                        fow="bold"
                        m={0}
                    >
                        {payload?.product?.name}
                    </H4>
                </XStack>
                <YStack
                    f={1}
                    minHeight={0}
                >
                    {render ?
                        <PurchasableProvider product={payload?.product}>
                            {render({ close: closeModal, payload })}
                        </PurchasableProvider> : null
                    }
                </YStack>
            </Sheet.Frame>

        </Sheet >
    );
}
