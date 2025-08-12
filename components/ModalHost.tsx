// ModalHost.tsx
import { ThemedButton } from '@/components/ui/themed-components';
import { RenderFn, useModalStore } from '@/stores/modalStore';
import { ChevronDown } from '@tamagui/lucide-icons';
import React from 'react';
import { H4, Sheet, SizableText, XStack, YStack } from 'tamagui';

export const ModalHost = () => {
    const { open, render, payload, closeModal, replaceModal, version } = useModalStore();

    const replace = <N,>(r: RenderFn<N>, p?: N) => replaceModal(r, p);
    const renderAny = render as RenderFn<unknown> | null;

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
                <ModalErrorBoundary>
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
                            {"abc"}
                        </H4>
                    </XStack>
                    <YStack
                        f={1}
                        minHeight={0}
                    >
                        {renderAny ? renderAny({ close: closeModal, replace, payload }) : null}
                    </YStack>
                </ModalErrorBoundary>
            </Sheet.Frame>

        </Sheet >
    );
}

class ModalErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; err?: any }> {
    state = { hasError: false, err: undefined };
    static getDerivedStateFromError(err: any) { return { hasError: true, err }; }
    render() {
        if (this.state.hasError) {
            return (
                <YStack f={1} ai="center" jc="center" p="$4" gap="$3">
                    <H4>Oops, something went wrong</H4>
                    <SizableText>{String(this.state.err)}</SizableText>
                    {/* optional: a "Report" or "Retry" button */}
                </YStack>
            );
        }
        return this.props.children;
    }
}