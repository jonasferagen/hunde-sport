import { darken, getLuminance,lighten, rgba } from 'polished';
import React, { useMemo } from 'react';
import { getVariableValue,useTheme } from 'tamagui';
import { LinearGradient } from 'tamagui/linear-gradient';

type Props = React.ComponentProps<typeof LinearGradient> & {
    /** Explicit start color. If omitted, uses current theme token (default 'background'). */
    fromColor?: string;
    /** Explicit end color. If omitted, we derive it by lightening/darkening fromColor. */
    toColor?: string;
    /** Theme token to use when fromColor is not provided (default 'background'). */
    token?: string;
    /** Alpha applied to the computed colors (default 0.9). */
    alpha?: number;
    /** When deriving without toColor, how much to tweak the top color. */
    amountTop?: number;      // default 0.05
    /** When deriving without toColor, how much to tweak the bottom color. */
    amountBottom?: number;   // default 0.10
};

export const ThemedLinearGradient: React.FC<Props> = ({
    fromColor,
    toColor,
    token = 'background',
    alpha = 0.9,
    amountTop = 0.05,
    amountBottom = 0.1,
    start = [0, 0] as any,
    end = [1, 1] as any,
    fullscreen = true,
    pointerEvents = 'none',
    ...rest
}) => {
    // Fallback when no fromColor provided: read current theme token once
    const theme = useTheme();
    const tokenColor = useMemo(
        () => String(getVariableValue((theme as any)[token])),
        [theme, token]
    );
    const base = fromColor ?? tokenColor;

    // If toColor given, just use it; else derive a subtle vertical delta
    const isLight = getLuminance(base) > 0.5;
    const top = toColor
        ? rgba(base, alpha)
        : rgba(isLight ? darken(amountTop, base) : lighten(amountTop, base), alpha);
    const bottom = toColor
        ? rgba(toColor, alpha)
        : rgba(isLight ? darken(amountBottom, base) : lighten(amountBottom, base), alpha);

    return (
        <LinearGradient
            start={start}
            end={end}
            colors={[top, bottom]}
            fullscreen={fullscreen}
            pointerEvents={pointerEvents}
            {...rest}
        />
    );
};
