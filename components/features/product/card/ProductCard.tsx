import React from 'react';
import { StackProps, XStack, YStack } from 'tamagui';

interface ProductCardProps extends StackProps {
    children: React.ReactNode;
}

export const ProductCard = ({ children, ...props }: ProductCardProps) => {
    return (
        <YStack {...props}>
            <XStack
                als="stretch"
                jc="flex-start"
                gap="$3"
            >
                {children}
            </XStack>
        </YStack>
    );
};
