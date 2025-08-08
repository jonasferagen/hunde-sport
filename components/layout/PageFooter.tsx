import React from 'react';
import { YStack, YStackProps } from 'tamagui';
import { ThemedLinearGradient } from '../ui/ThemedLinearGradient';

interface PageHeaderProps extends YStackProps {
    children?: React.ReactNode;
}

export const PageFooter: React.FC<PageHeaderProps> = ({ children, ...props }) => {

    return <YStack
        p="$3"
        bbw={1}
        boc={"$borderColor"}
        gap="$3"
        {...props}
    >
        <ThemedLinearGradient />
        {children}
    </YStack>
}
