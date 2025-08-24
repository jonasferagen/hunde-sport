import { ThemedButton, ThemedLinearGradient, ThemedText, ThemedTextProps } from '@/components/ui/themed-components'
import * as Haptics from 'expo-haptics'
import React from 'react'
import { GestureResponderEvent } from 'react-native'
import { Theme, ThemeName } from 'tamagui'


interface CallToActionButtonProps
    extends Omit<React.ComponentProps<typeof ThemedButton>, 'onPress' | 'disabled' | 'theme'> {
    onPress?: ((event: GestureResponderEvent) => void) | null
    disabled?: boolean
    before?: React.ReactNode
    after?: React.ReactNode
    theme: ThemeName
    label?: string
}
export const CallToActionButton = React.forwardRef<
    React.ComponentRef<typeof ThemedButton>,
    CallToActionButtonProps
>(function CallToActionButton(
    { onPress, disabled, theme, before, after, label, children, ...props },
    ref
) {
    const handlePress = (event: GestureResponderEvent) => {
        if (disabled) return
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
        onPress?.(event)
    }

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
                <ThemedButton.Before>{before}</ThemedButton.Before>

                <ThemedButton.Text>
                    {label && <ThemedText price>{label}</ThemedText>}
                    {children}
                </ThemedButton.Text>

                <ThemedButton.After>{after}</ThemedButton.After>
            </ThemedButton>
        </Theme>
    )
})
