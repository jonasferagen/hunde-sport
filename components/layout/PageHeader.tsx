import React from 'react';
import { H4, YStack, YStackProps } from 'tamagui';
import { ThemedLinearGradient } from '../ui/themed-components/ThemedLinearGradient';

interface PageHeaderProps extends YStackProps {
    title?: string;
    children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, children, ...props }) => {

    return <YStack
        p="$3"
        bbw={1}
        boc={"$borderColor"}
        gap="$3"
        {...props}
    >
        <ThemedLinearGradient />
        {title && <H4>{title}</H4>}
        {children}
    </YStack>
}
