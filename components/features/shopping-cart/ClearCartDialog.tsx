import { ThemedButton } from '@/components/ui/ThemedButton';
import React, { JSX } from 'react';
import { Dialog, H3, Paragraph, XStack, YStack } from 'tamagui';

interface ClearCartDialogProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export const ClearCartDialog = ({ isOpen, onConfirm, onCancel }: ClearCartDialogProps): JSX.Element => {
    return (
        <Dialog open={isOpen} onOpenChange={onCancel}>
            <Dialog.Portal>
                <Dialog.Overlay
                    key="overlay"
                    animation="quick"
                    opacity={1}
                    enterStyle={{ opacity: 0 }}
                    exitStyle={{ opacity: 0 }}
                />
                <Dialog.Content
                    background="white"
                    borderRadius="$4"
                    borderWidth={1}
                    borderColor="$borderColor"
                    elevate
                    key="content"
                    animation={[
                        'quick',
                        {
                            opacity: {
                                overshoot: true,
                            },
                        },
                    ]}
                    enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
                    exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
                    x={0}
                    scale={1}
                    opacity={1}
                    y={0}
                >
                    <YStack gap="$3" background="$background">
                        <Dialog.Title>
                            <H3>Tøm handlekurv</H3>
                        </Dialog.Title>
                        <Dialog.Description>
                            <Paragraph>Er du sikker på at du vil tømme handlekurven?</Paragraph>
                        </Dialog.Description>

                        <XStack gap="$3" justifyContent="flex-end">
                            <Dialog.Close asChild>
                                <ThemedButton onPress={onCancel}>Avbryt</ThemedButton>
                            </Dialog.Close>
                            <Dialog.Close asChild>
                                <ThemedButton theme="red" onPress={onConfirm}>
                                    Tøm
                                </ThemedButton>
                            </Dialog.Close>
                        </XStack>
                    </YStack>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog>
    );
};
