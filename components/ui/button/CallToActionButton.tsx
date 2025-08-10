import { ThemedButton } from '@/components/ui/themed-components/ThemedButton';
import { ThemedLinearGradient } from '@/components/ui/themed-components/ThemedLinearGradient';
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
                    startPoint={[1, 1]}
                    endPoint={[0, 0]}
                    zIndex={0}
                    opacity={1}
                    pointerEvents="none"
                    $group-press={{ opacity: 0 }}
                />

                {icon}
                <XStack
                    ai="center"
                    jc="space-between"
                    f={1}
                    fg={1}
                    px="none"
                    gap="$2"
                >
                    <ThemedText fow="bold"
                        fos="$4"
                        f={1}
                        textAlign='left'>
                        {children}
                    </ThemedText>
                    {textAfter && <ThemedText
                        fow="bold"
                        fos="$4"
                        f={0}
                        textAlign='right'>
                        {textAfter}
                    </ThemedText>
                    }
                </XStack>
                {iconAfter}
            </ThemedButton>
        </Theme>
    );
});
