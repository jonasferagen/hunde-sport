import React from 'react';
import { H4, YStack, YStackProps } from 'tamagui';

interface PageHeaderProps extends YStackProps {
    title?: string;
    children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, children, ...props }) => {
    return (
        <YStack
            padding="$space.md"
            borderBottomWidth={1}
            backgroundColor="$background"
            borderColor="$borderColor"
            gap="$space.md"
            {...props}
        >
            {title && <H4>{title}</H4>}
            {children}
        </YStack>
    );
};
