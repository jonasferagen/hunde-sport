import { ThemedButton } from '@/components/ui/ThemedButton';
import { ThemedLinearGradient } from '@/components/ui/ThemedLinearGradient';
import React, { JSX } from 'react';

import { Theme, XStack, YStackProps } from 'tamagui';
import { ThemedText } from '../ThemedText';

interface CallToActionButtonProps extends YStackProps {
    children: React.ReactNode;
    icon?: JSX.Element;
    iconAfter?: JSX.Element;
}

export const CallToActionButton = React.forwardRef<
    React.ComponentRef<typeof ThemedButton>,
    CallToActionButtonProps
>(({ children, icon, iconAfter, ...props }, ref) => {


    return (
        <Theme name={props.theme}>
            <ThemedButton
                f={1}
                ref={ref}
                position="relative"
                m="none"
                p="none"
                bw={0}
                pr="$3"
                br="$3"
                boxSizing="border-box"
                flexDirection='row'
                ai="center"
                group
                {...props}
            >
                <ThemedLinearGradient
                    strong
                    br="$3"
                    fullscreen
                    zIndex={0}
                    opacity={0}
                    pointerEvents="none"
                    $group-press={{ opacity: 1 }}
                />

                {icon}
                <XStack
                    ai="center"
                    f={1}
                    fg={1}
                    px="none"
                    gap="$2"
                >
                    <ThemedText fow="bold" fos="$4" f={1} textAlign='left'>
                        {children}
                    </ThemedText>
                </XStack>
                {iconAfter}
            </ThemedButton>
        </Theme>
    );
});
