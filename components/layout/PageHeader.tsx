import React from 'react';
import { H4, YStackProps } from 'tamagui';
import { ThemedYStack } from '../ui';
import { ThemedLinearGradient } from '../ui/themed-components/ThemedLinearGradient';

interface PageHeaderProps extends YStackProps {
    title?: string;
    children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, children, ...props }) => {

    return <ThemedYStack
        theme="soft"
        preset="container"
        bbw={1}
        boc="$borderColor"
        {...props}
    >
        <ThemedLinearGradient />
        {title && <H4>{title}</H4>}
        {children}
    </ThemedYStack>
}
