import React from 'react';
import { Theme, YStackProps } from 'tamagui';
import { ThemedYStack } from '../ui';
import { ThemedLinearGradient } from '../ui/themed-components/ThemedLinearGradient';

interface PageFooterProps extends YStackProps {
    children?: React.ReactNode;

}

export const PageFooter: React.FC<PageFooterProps> = ({ children, ...props }) => {

    return (
        <Theme name="secondary">
            <ThemedYStack
                container
                box
                bbw={0}
                {...props}
            >
                <ThemedLinearGradient />
                {children}
            </ThemedYStack>
        </Theme>

    );
}
