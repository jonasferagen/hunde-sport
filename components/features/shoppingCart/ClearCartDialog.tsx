import React, { JSX } from 'react';
import { AlertDialog, Button, Dialog, H3, Paragraph, XStack, YStack } from 'tamagui';

interface ClearCartDialogProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export const ClearCartDialog = ({ isOpen, onConfirm, onCancel }: ClearCartDialogProps): JSX.Element => {
    return (
        <Dialog open={isOpen} onOpenChange={onCancel}>
            <AlertDialog>
                <AlertDialog.Portal>
                    <AlertDialog.Overlay
                        key="overlay"
                        animation="quick"
                        opacity={0.5}
                        enterStyle={{ opacity: 0 }}
                        exitStyle={{ opacity: 0 }}
                    />
                    <AlertDialog.Content
                        bordered
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
                        <YStack gap="$3">
                            <AlertDialog.Title>
                                <H3>Tøm handlekurv</H3>
                            </AlertDialog.Title>
                            <AlertDialog.Description>
                                <Paragraph>Er du sikker på at du vil tømme handlekurven?</Paragraph>
                            </AlertDialog.Description>

                            <XStack gap="$3" justifyContent="flex-end">
                                <AlertDialog.Cancel asChild>
                                    <Button onPress={onCancel}>Avbryt</Button>
                                </AlertDialog.Cancel>
                                <AlertDialog.Action asChild>
                                    <Button theme="red" onPress={onConfirm}>
                                        Tøm
                                    </Button>
                                </AlertDialog.Action>
                            </XStack>
                        </YStack>
                    </AlertDialog.Content>
                </AlertDialog.Portal>
            </AlertDialog>
        </Dialog>
    );
};
