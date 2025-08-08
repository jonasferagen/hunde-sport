import { ThemedButton } from '@/components/ui/ThemedButton';
import React from 'react';

import { Button, ButtonProps, Theme, XStack } from 'tamagui';
import { ThemedText } from '../ThemedText';

interface CallToActionButtonProps extends ButtonProps {
    children: React.ReactNode;
}

export const CallToActionButton = React.forwardRef<
    React.ComponentRef<typeof Button>,
    CallToActionButtonProps
>(({ children, ...props }, ref) => {
    const { icon, iconAfter, ...restProps } = props;

    return (
        <Theme name={props.theme}>
            <ThemedButton
                ref={ref}
                position="relative"
                gap="none"
                ai="center"
                px="$2"
                mx="none"
                {...restProps}
            >
                <XStack f={1} ai="center" gap="$2" fg={1} h="100%">
                    {icon}
                    <XStack ai="center" jc="space-between" f={1} fg={1} px="none">
                        {React.Children.map(children, child => (
                            <ThemedText fow="bold" fos="$4">
                                {child}
                            </ThemedText>
                        ))}
                    </XStack>
                    {iconAfter}

                </XStack>
            </ThemedButton>
        </Theme>
    );
});

//          <ThemedLinearGradient fullscreen br="$3" zIndex={-1} />