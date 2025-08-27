// components/ui/CallToActionButton.tsx
import * as Haptics from 'expo-haptics';
import React from 'react';
import { GestureResponderEvent } from 'react-native';
import { Theme, ThemeName } from 'tamagui';

import { ThemedSpinner } from '@/components/ui'; // assuming this re-exports a spinner
import { ThemedButton, ThemedText } from '@/components/ui/themed-components';

type CallToActionButtonProps = React.ComponentProps<typeof ThemedButton> & {
    label?: string;
    theme?: ThemeName;
    before?: React.ReactNode;
    after?: React.ReactNode;
    loading?: boolean;                  // NEW: replaces the label with a spinner/alt label
    loadingLabel?: string | null;       // optional text instead of spinner
    spinner?: React.ReactNode;          // optional custom spinner
    disableHapticsWhileLoading?: boolean;
};

export const CallToActionButton = React.forwardRef<
    React.ComponentRef<typeof ThemedButton>,
    CallToActionButtonProps
>(function CallToActionButton(
    {
        onPress,
        disabled,
        theme,
        before,
        after,
        label,
        loading = false,
        loadingLabel = null,
        spinner,
        disableHapticsWhileLoading = true,
        ...props
    },
    ref
) {
    const isDisabled = disabled || loading;

    const handlePress = (event: GestureResponderEvent) => {
        if (isDisabled) return;
        // Optional: skip haptics while loading/disabled
        if (!(disableHapticsWhileLoading && loading)) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
        onPress?.(event);
    };

    return (
        <Theme name={theme}>
            <ThemedButton
                ref={ref}
                onPress={handlePress}
                disabled={isDisabled}
                aria-label={label}
                aria-busy={loading}
                accessibilityState={{ disabled: isDisabled, busy: loading }}
                bw={2}
                {...props}
            >
                <ThemedButton.Before>{before}</ThemedButton.Before>
                <ThemedButton.Text>
                    {loading
                        ? (loadingLabel !== null
                            ? <ThemedText>{loadingLabel}</ThemedText>
                            : (spinner ?? <ThemedSpinner />))
                        : (label ? <ThemedText tabular>{label}</ThemedText> : null)}
                </ThemedButton.Text>

                <ThemedButton.After>{after}</ThemedButton.After>
            </ThemedButton>
        </Theme>
    );
});
