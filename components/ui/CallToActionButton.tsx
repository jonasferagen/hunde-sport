// components/ui/CallToActionButton.tsx
import * as Haptics from "expo-haptics";
import React from "react";
import type { GestureResponderEvent } from "react-native";
import { Theme, type ThemeName } from "tamagui";

import { ThemedSpinner, ThemedText, ThemedXStack } from "@/components/ui";
import { ThemedButton } from "@/components/ui/themed-components";

type CallToActionButtonProps = React.ComponentProps<typeof ThemedButton> & {
  label?: string;
  before?: React.ReactNode;
  after?: React.ReactNode;
  theme?: ThemeName;
  /** NEW: custom right-side content (renamed to avoid Tamagui 'right' prop) */
  trailing?: React.ReactNode;
  /** Left label loading (e.g. redirect) */
  loading?: boolean;
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
    trailing,
    loading = false,
    ...props
  },
  ref
) {
  const isDisabled = disabled || loading;

  const handlePress = (e: GestureResponderEvent) => {
    if (isDisabled) return;
    if (loading) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress?.(e);
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

        {/* Left label */}
        <ThemedButton.Text>
          {loading ? (
            <ThemedSpinner />
          ) : label ? (
            <ThemedText tabular>{label}</ThemedText>
          ) : null}
        </ThemedButton.Text>

        {/* Flexible middle/right area that pushes the arrow to the edge */}
        <ThemedXStack f={1} jc="flex-end" ai="center">
          {trailing}
        </ThemedXStack>

        {/* Arrow or whatever */}
        <ThemedButton.After>{after}</ThemedButton.After>
      </ThemedButton>
    </Theme>
  );
});
