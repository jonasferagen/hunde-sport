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
                group
                position="relative"
                mx="none"
                px="$3"
                py="$2.5"
                gap="$3"
                flexDirection='row'
                ai="center"
                {...props}
            >
                <ThemedLinearGradient

                    $group-focus={{ opacity: 0 }}
                    colors={['$background', '$backgroundElevated']}
                    fullscreen
                    br="$3"
                    zIndex={-1} />
                {icon}
                <XStack ai="center"
                    jc="flex-end"
                    f={1}
                    fg={1}
                    px="none" >
                    <ThemedText fow="bold" fos="$4">
                        {children}
                    </ThemedText>
                </XStack>
                {iconAfter}
            </ThemedButton>
        </Theme>
    );
});

