import { ThemedButton } from '@/components/ui/themed-components/ThemedButton';
import { ButtonProps } from '@tamagui/button';
import React from 'react';
import { Theme, XStack } from 'tamagui';
import { ThemedText } from '../themed-components/ThemedText';

interface CallToActionButtonProps extends ButtonProps {
    children: React.ReactNode;
    textAfter?: string;
}

export const CallToActionButton = React.forwardRef<
    React.ComponentRef<typeof ThemedButton>,
    CallToActionButtonProps
>(({ children, textAfter, icon, iconAfter, ...props }, ref) => {


    return (
        <Theme name={props.theme}>
            <ThemedButton
                ref={ref}
                position="relative"
                m="none"
                px="$3"
                bw={0}
                h="$6"
                br="$3"
                boxSizing="border-box"
                fd='row'
                ai="center"
                group
                {...props}
            >
                {icon}
                <XStack
                    ai="center"
                    jc="space-between"
                    f={1}
                    fg={1}
                    px="none"
                    gap="$2"
                >
                    <ThemedText
                        fow="bold"
                        fos="$4"
                        f={1}
                    >
                        {children}
                    </ThemedText>
                    {textAfter && <ThemedText
                        fow="bold"
                        fos="$4"
                        f={0}
                    >
                        {textAfter}
                    </ThemedText>
                    }
                </XStack>
                {iconAfter}
            </ThemedButton>
        </Theme>
    );
});
