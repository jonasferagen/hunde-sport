import { ThemedText } from '@/components/ui/themed-components/ThemedText';
import React from 'react';
import { StackProps, YStack } from 'tamagui';

interface DefaultTextContentProps {
    children: React.ReactNode;
    stackProps?: StackProps;
}

export const DefaultTextContent = ({ stackProps, children }: DefaultTextContentProps) => {
    return (
        <YStack f={1} ai="center" jc="center" {...stackProps}>
            <ThemedText size="$5" ta="center">
                {children}
            </ThemedText>
        </YStack>
    );
};