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
                {...props}
            >
                <ThemedLinearGradient
                    br="$3"
                    fullscreen
                    pressStyle={{ backgroundColor: '$backgroundPress', }}
                    zIndex={-1}
                    opacity={0}
                />

                {icon}
                <XStack ai="center"
                    jc="flex-end"
                    f={1}
                    fg={1}
                    px="none"

                >
                    <ThemedText fow="bold" fos="$4" boc="black" bw={1} f={1} >
                        {children}
                    </ThemedText>
                </XStack>
                {iconAfter}
            </ThemedButton>
        </Theme>
    );
});

