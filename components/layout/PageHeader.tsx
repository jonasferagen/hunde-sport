import { THEME_PAGE_HEADER } from '@/config/app';
import React from 'react';
import { Theme, YStackProps } from 'tamagui';
import { ThemedText, ThemedYStack } from '../ui';
import { ThemedLinearGradient } from '../ui/themed-components/ThemedLinearGradient';

interface PageHeaderProps extends YStackProps {
    title?: string;
    children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, children, ...props }) => {

    return (
        <Theme name={THEME_PAGE_HEADER}>
            <ThemedYStack
                btw={0}
                {...props}
            >
                <ThemedLinearGradient />
                {title && <ThemedText size="$4">{title}</ThemedText>}
                {children}
            </ThemedYStack>
        </Theme>
    );
}
