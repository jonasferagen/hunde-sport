import { ThemedButton } from '@/components/ui/themed-components/ThemedButton';
import { ButtonProps } from '@tamagui/button';
import React from 'react';

interface CallToActionButtonProps extends ButtonProps {
    children: React.ReactNode;
    after?: React.ReactNode;
}

export const CallToActionButton = React.forwardRef<
    React.ComponentRef<typeof ThemedButton>,
    CallToActionButtonProps
>(({ children, after, icon, ...props }, ref) => {

    return (
        <ThemedButton
            ref={ref}
            position="relative"
            {...props}
        >
            <ThemedButton.Icon>
                {icon}
            </ThemedButton.Icon>
            <ThemedButton.Text>
                {children}
            </ThemedButton.Text>
            {after}
        </ThemedButton>

    );
});
