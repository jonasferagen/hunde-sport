// ThemedLinearGradient.tsx
import { darken, getLuminance, lighten, rgba } from 'polished'
import React, { useMemo } from 'react'
import { getVariableValue, useTheme } from 'tamagui'
import { LinearGradient } from 'tamagui/linear-gradient'

export function ThemedLinearGradient({ token = "background", ...props }: React.ComponentProps<typeof LinearGradient> & { token?: string }) {

    const theme = useTheme()

    const base = (getVariableValue(theme[token]) as string)
    const isLight = getLuminance(base) > 0.5

    // derive a subtle 2–3 stop gradient from the active surface
    const colors = useMemo(() => {
        const top = rgba(isLight ? darken(0.05, base) : lighten(0.05, base), 0.9)
        const mid = rgba(base, 0.85)
        const bottom = rgba(isLight ? darken(0.1, base) : lighten(0.1, base), 0.9)
        return [top, mid, bottom]
    }, [base, isLight])

    return (
        <LinearGradient
            fullscreen
            pointerEvents="none"
            start={[0, 0]}
            end={[1, 1]}
            colors={colors}
            {...props}
        />
    )
}
