import { ThemedButton } from '@/components/ui/themed-components/ThemedButton';
import { ButtonProps } from '@tamagui/button';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { ThemeName } from 'tamagui';
import { ThemedText } from '../themed-components';
interface CallToActionButtonProps extends Omit<ButtonProps, 'onPress' | 'disabled' | 'icon' | 'theme'> {
    onPress: () => void;
    disabled?: boolean;
    icon: React.ReactNode;
    theme?: ThemeName;
    label: string;
    after?: React.ReactNode;
}

export const CallToActionButton = React.forwardRef<
    React.ComponentRef<typeof ThemedButton>,
    CallToActionButtonProps
>(({ onPress, disabled, icon, theme, label, after, ...props }, ref) => {

    const handlePress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onPress();
    };

    return (
        <ThemedButton
            theme={theme}
            ref={ref}
            onPress={handlePress}
            disabled={disabled}
            aria-label={label}
            p="$2"
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
            </ThemedButton.Text>
            {after &&
                <ThemedButton.After>
                    {after}
                </ThemedButton.After>
            }
        </ThemedButton>
    );
});
