import React from 'react';
import { H4, Theme, YStack, YStackProps } from 'tamagui';

interface PageHeaderProps extends YStackProps {
    title?: string;
    children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, children, ...props }) => {
    return (
        <Theme name="secondary">

            <YStack
                padding="$3"
                borderBottomWidth={1}
                backgroundColor="$background"
                borderColor="$borderColor"
                gap="$3"
                {...props}
            >
                {title && <H4>{title}</H4>}
                {children}
            </YStack>
        </Theme>
    );
};
