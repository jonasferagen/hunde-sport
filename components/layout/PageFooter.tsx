import React from 'react';
import { YStackProps } from 'tamagui';
import { ThemedYStack } from '../ui';
import { ThemedLinearGradient } from '../ui/themed-components/ThemedLinearGradient';

interface PageFooterProps extends YStackProps {
    children?: React.ReactNode;

}

export const PageFooter: React.FC<PageFooterProps> = ({ children, ...props }) => {

    return <ThemedYStack
        theme="soft"
        preset="container"
        {...props}
    >
        <ThemedLinearGradient />
        {children}
    </ThemedYStack>
}
