import React from 'react';
import { YStackProps } from 'tamagui';
import { ThemedText, ThemedYStack } from '../ui';
import { ThemedLinearGradient } from '../ui/themed-components/ThemedLinearGradient';

interface PageHeaderProps extends YStackProps {
    title?: string;
    children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, children, ...props }) => {

    return (
        <ThemedYStack
            theme="tint"
            container
            bbw={1}

            {...props}
        >
            <ThemedLinearGradient />
            {title && <ThemedText size="$4">{title}</ThemedText>}
            {children}
        </ThemedYStack>
    );
}
