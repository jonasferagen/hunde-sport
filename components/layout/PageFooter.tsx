import { THEME_PAGE_FOOTER } from '@/config/app';
import React from 'react';
import { Theme, YStackProps } from 'tamagui';
import { ThemedYStack } from '../ui';

interface PageFooterProps extends YStackProps {
    children?: React.ReactNode;

}

export const PageFooter: React.FC<PageFooterProps> = ({ children, ...props }) => {

    return (
        <Theme name={THEME_PAGE_FOOTER}>
            <ThemedYStack
                boc="blue"
                container
                box
                bw={3}
                btw={1}
                {...props}
            >

                {children}

            </ThemedYStack>
        </Theme>

    );
}
