import React from 'react';
import { H4, YStackProps } from 'tamagui';
import { ThemedLinearGradient } from '../ui/ThemedLinearGradient';

interface PageHeaderProps extends YStackProps {
    title?: string;
    children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, children, ...props }) => {

    return (
        <ThemedLinearGradient

            padding="$3"
            borderBottomWidth={1}
            borderColor={"$borderColor"}
            gap="$3"
            {...props}
        >
            {title && <H4>{title}</H4>}
            {children}
        </ThemedLinearGradient>
    );
}
