// ModalHost.tsx
import { ThemedLinearGradient } from '@/components/ui';
import { PurchasableProvider } from '@/contexts';
import { useModalStore, WizardRenderFn } from '@/stores/modalStore';
import React from 'react';
import { Sheet, Theme, YStack } from 'tamagui';

export const ModalHost = () => {


    const { open, render, payload, version, closeModal, updatePayload } = useModalStore();

    const renderAny = render as WizardRenderFn<unknown> | null;
    const update = <P,>(next: P) => updatePayload(next);

    return (
        <Theme name="secondary">
            <Sheet
                modal
                native
                open={open}
                onOpenChange={(o: boolean) => { if (!o) closeModal(); }}
                snapPointsMode="percent"
                snapPoints={[90]}   // 0: compact, 1: tall
                unmountChildrenWhenHidden
                dismissOnSnapToBottom={true}
                animation="fast"
            >
                <Sheet.Overlay bg="white" opacity={0.2} />
                <Sheet.Frame f={1} mih={0} p="$4" gap="$3">
                    <ThemedLinearGradient />
                    <YStack

                        key={version}
                        f={1}
                        mih={0}
                    >
                        {renderAny ? (
                            <PurchasableProvider purchasable={payload as any}>
                                {renderAny({ close: closeModal, payload, updatePayload: update })}
                            </PurchasableProvider>
                        ) : null}

                    </YStack>
                </Sheet.Frame>
            </Sheet >
        </Theme>

    );
}
