import React from 'react';
import { YStack, YStackProps } from 'tamagui';

interface PageHeaderProps extends YStackProps {
    children?: React.ReactNode;
}

export const PageFooter: React.FC<PageHeaderProps> = ({ children, ...props }) => {

    return <YStack
        p="$3"
        gap="$3"
        position="relative"
        {...props}
    >
        {children}
    </YStack>
}
