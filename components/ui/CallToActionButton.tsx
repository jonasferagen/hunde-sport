import { ThemedButton } from '@/components/ui/themed-components/ThemedButton';
import { THEME_CTA_BUTTON } from '@/config/app';
import { ButtonProps } from '@tamagui/button';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { GestureResponderEvent } from 'react-native';
import { ThemeName } from 'tamagui';
import { ThemedText } from './themed-components';

interface CallToActionButtonProps extends Omit<ButtonProps, 'onPress' | 'disabled' | 'icon' | 'theme'> {
    onPress?: ((event: GestureResponderEvent) => void) | null;
    disabled?: boolean;
    icon?: ButtonProps['icon'];
    iconAfter?: ButtonProps['icon'];
    theme?: ThemeName | null;
    label: string;
}

export const CallToActionButton = React.forwardRef<
    React.ComponentRef<typeof ThemedButton>,
    CallToActionButtonProps
>(({ onPress,
    disabled,
    theme = THEME_CTA_BUTTON,
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
        <ThemedButton
            theme={theme}
            ref={ref}
            onPress={handlePress}
            disabled={disabled}
            aria-label={label}
            h="$6"
            bw={2}
            shadowColor="#000"
            shadowOffset={{ width: 0, height: 2 }}
            shadowOpacity={disabled ? 0 : 0.25}
            shadowRadius={3.84}
            animation="fast"
            ov="hidden"
            {...props}
        >
            <ThemedButton.Icon>{icon}</ThemedButton.Icon>
            <ThemedButton.Text fg={1}>
                <ThemedText fos="$4">{label}</ThemedText>
                {children}
            </ThemedButton.Text>
            <ThemedButton.Icon>
                {iconAfter}
            </ThemedButton.Icon>

        </ThemedButton>
    );
});
