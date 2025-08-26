// ThemedLinearGradient.tsx
import { darken, getLuminance, lighten, rgba } from 'polished'
import React, { useEffect, useMemo, useState } from 'react'
import { DimensionValue } from 'react-native'
import { Theme, ThemeName, getVariableValue, styled, useTheme } from 'tamagui'
import type { LinearGradientProps } from 'tamagui/linear-gradient'
import { LinearGradient } from 'tamagui/linear-gradient'
/** Base styled gradient */
export const LinearGradientBase = styled(LinearGradient, {
    name: 'ThemedLinearGradient',
    fullscreen: true,
    pointerEvents: 'none',
})

type ThemeRef = {
    theme: string
    token?: string
}

export type ThemedLinearGradientProps = LinearGradientProps & {
    token?: string
    fromTheme?: ThemeRef
    toTheme?: ThemeRef
    alpha?: number
    amountTop?: number
    amountBottom?: number
}

/** Resolve a token within the wrapping <Theme> and report its color string */
const ThemeColorProbe: React.FC<{
    token: string
    onColor: (c: string) => void
}> = ({ token, onColor }) => {
    const theme = useTheme()
    const tval = theme[token as keyof typeof theme]
    const color = useMemo(() => String(getVariableValue(tval)), [tval])
    useEffect(() => onColor(color), [color, onColor])
    return null
}

const DEFAULT_START: [DimensionValue, DimensionValue] = [0, 0];
const DEFAULT_END: [DimensionValue, DimensionValue] = [1, 1]

export const ThemedLinearGradient = React.memo(function ThemedLinearGradient({
    token = 'background',
    fromTheme,
    toTheme,
    alpha = 0.9,
    amountTop = 0.05,
    amountBottom = 0.1,
    start = DEFAULT_START as any,
    end = DEFAULT_END as any,
    ...rest
}: ThemedLinearGradientProps) {
    // base color from current theme
    const theme = useTheme()
    const tokenValue = theme[token as keyof typeof theme]
    const currentBase = useMemo(() => String(getVariableValue(tokenValue)), [tokenValue])

    // cross-theme probes (lazy resolve)
    const [fromColor, setFromColor] = useState<string | null>(null)
    const [toColor, setToColor] = useState<string | null>(null)
    const resolvedFrom = fromTheme ? fromColor ?? currentBase : currentBase
    const resolvedTo = toTheme ? toColor : null

    const isLight = useMemo(() => getLuminance(resolvedFrom) > 0.5, [resolvedFrom])

    const [top, bottom] = useMemo<[string, string]>(() => {
        if (resolvedTo) {
            return [rgba(resolvedFrom, alpha), rgba(resolvedTo, alpha)]
        }
        const topC = rgba(isLight ? darken(amountTop, resolvedFrom) : lighten(amountTop, resolvedFrom), alpha)
        const botC = rgba(isLight ? darken(amountBottom, resolvedFrom) : lighten(amountBottom, resolvedFrom), alpha)
        return [topC, botC]
    }, [resolvedFrom, resolvedTo, alpha, amountTop, amountBottom, isLight])

    return (
        <>
            {fromTheme && (
                <Theme name={fromTheme.theme as ThemeName}>
                    <ThemeColorProbe token={fromTheme.token ?? 'background'} onColor={setFromColor} />
                </Theme>
            )}
            {toTheme && (
                <Theme name={toTheme.theme as ThemeName}>
                    <ThemeColorProbe token={toTheme.token ?? 'background'} onColor={setToColor} />
                </Theme>
            )}

            {/* Cast tuple vectors back to the native gradient prop type to avoid the style-prop collision */}
            <LinearGradientBase
                start={start as any}
                end={end as any}
                colors={[top, bottom]}
                {...rest}
            />
        </>
    )
}, (prev, next) => {
    const je = JSON.stringify
    return (
        prev.token === next.token &&
        prev.alpha === next.alpha &&
        prev.amountTop === next.amountTop &&
        prev.amountBottom === next.amountBottom &&
        je(prev.start ?? DEFAULT_START) === je(next.start ?? DEFAULT_START) &&
        je(prev.end ?? DEFAULT_END) === je(next.end ?? DEFAULT_END) &&
        (prev.fromTheme?.theme ?? '') === (next.fromTheme?.theme ?? '') &&
        (prev.fromTheme?.token ?? 'background') === (next.fromTheme?.token ?? 'background') &&
        (prev.toTheme?.theme ?? '') === (next.toTheme?.theme ?? '') &&
        (prev.toTheme?.token ?? 'background') === (next.toTheme?.token ?? 'background')
    )
})
