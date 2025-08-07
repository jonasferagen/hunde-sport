import { ThemedButton } from '@/components/ui/ThemedButton';
import { ThemedLinearGradient } from '@/components/ui/ThemedLinearGradient';
import React from 'react';

import { Button, ButtonProps, Theme } from 'tamagui';

interface CallToActionButtonProps extends ButtonProps {
    children: React.ReactNode;
}

export const CallToActionButton = React.forwardRef<
    React.ComponentRef<typeof Button>,
    CallToActionButtonProps
>(({ children, ...props }, ref) => {
    return (
        <Theme name={props.theme}>
            <ThemedButton
                ref={ref}
                gap={0}
                ai="center"
                jc="space-between"
                m="none"
                fontSize="$4"
                scaleIcon={1.5}
                {...props}
            >
                <ThemedLinearGradient br="$3" zIndex={-1} />
                {children}
            </ThemedButton>
        </Theme>
    );
});