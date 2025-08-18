import { ThemedButton } from '@/components/ui/themed-components/ThemedButton';
import { ButtonProps } from '@tamagui/button';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { GestureResponderEvent } from 'react-native';
import { Theme, ThemeName } from 'tamagui';
import { ThemedText } from './themed-components';



interface CallToActionButtonProps extends Omit<ButtonProps, 'onPress' | 'disabled' | 'icon' | 'theme'> {
    onPress?: ((event: GestureResponderEvent) => void) | null;
    disabled?: boolean;
    icon?: ButtonProps['icon'];
    iconAfter?: ButtonProps['icon'];
    theme: ThemeName;
    label?: string;
}

export const CallToActionButton = React.forwardRef<
    React.ComponentRef<typeof ThemedButton>,
    CallToActionButtonProps
>(({ onPress,
    disabled,
    theme,
    icon,
    label,
    iconAfter,
    children,
    ...props }, ref) => {

    const handlePress = (event: GestureResponderEvent) => {
        if (disabled) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onPress?.(event);
    };



    return (
        <Theme name={theme}>
            <ThemedButton
                ref={ref}
                onPress={handlePress}
                disabled={disabled}
                aria-label={label}
                bw={2}
                {...props}
            >
                <ThemedButton.Icon>{icon}</ThemedButton.Icon>
                <ThemedButton.Text w="100%" fs={1}>
                    <ThemedText>{label}</ThemedText>
                    {children}
                </ThemedButton.Text>
                <ThemedButton.Icon >
                    {iconAfter}
                </ThemedButton.Icon>

            </ThemedButton>
        </Theme>
    );
});
