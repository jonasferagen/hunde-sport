import React from 'react';
import { ThemeName, YStack, YStackProps } from 'tamagui';
import { ThemedLinearGradient } from '../ui/themed-components/ThemedLinearGradient';

interface PageHeaderProps extends YStackProps {
    children?: React.ReactNode;
    theme?: ThemeName;
}

export const PageFooter: React.FC<PageHeaderProps> = ({ children, theme = 'soft', ...props }) => {

    return <YStack
        p="$3"
        gap="$3"
        position="relative"
        theme={theme}
        {...props}
    >
        <ThemedLinearGradient />
        {children}
    </YStack>
}
