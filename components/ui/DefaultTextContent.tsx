import { ThemedText } from '@/components/ui/ThemedText';
import React from 'react';
import { YStack } from 'tamagui';

interface DefaultTextContentProps {
    children: React.ReactNode;
}

export const DefaultTextContent = ({ children }: DefaultTextContentProps) => {
    return (
        <YStack flex={1} ai="center" jc="center">
            <ThemedText fontSize="$3" ta="center">
                {children}
            </ThemedText>
        </YStack>
    );
};