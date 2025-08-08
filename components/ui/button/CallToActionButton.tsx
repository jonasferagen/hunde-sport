import { ThemedButton } from '@/components/ui/ThemedButton';
import { ThemedLinearGradient } from '@/components/ui/ThemedLinearGradient';
import React from 'react';

import { Theme, XStack, YStackProps } from 'tamagui';
import { ThemedText } from '../ThemedText';

interface CallToActionButtonProps extends YStackProps {
    children: React.ReactNode;
    icon?: React.ReactNode;
    iconAfter?: React.ReactNode;
}

export const CallToActionButton = React.forwardRef<
    React.ComponentRef<typeof ThemedButton>,
    CallToActionButtonProps
>(({ children, icon, iconAfter, ...props }, ref) => {

    return (
        <Theme name={props.theme}>
            <ThemedButton
                ref={ref}
                position="relative"
                gap="$2"
                ai="center"
                mx="none"
                {...props}
            >
                <ThemedLinearGradient fullscreen br="$3" zIndex={-1} />
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