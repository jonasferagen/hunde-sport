// ThemedLinearGradient.tsx
import { darken, getLuminance, lighten, rgba } from 'polished';
import React, { useMemo } from 'react';
import { getVariableValue, useTheme } from 'tamagui';
import { LinearGradient } from 'tamagui/linear-gradient';

type Props = (React.ComponentProps<typeof LinearGradient> & { token?: string });
// mutable tuples
const START: [number, number] = [0, 0];
const END: [number, number] = [1, 1];

export const ThemedLinearGradient = React.memo(function ThemedLinearGradient({
    token = 'background',
    ...rest
}: Props) {


    const theme = useTheme();
    // Read *just* the token so Tamagui only re-renders us when that token changes
    const tokenValue = theme[token as keyof typeof theme];
    // Resolve the CSS var to an actual color string; memo on the token’s value
    const base = useMemo(
        () => String(getVariableValue(tokenValue)),
        [tokenValue]
    );
    const isLight = useMemo(() => getLuminance(base) > 0.5, [base]);
    // Derive subtle 3-stop gradient
    // colors as a mutable array (or a mutable tuple)
    const colors = useMemo<[string, string, string]>(() => {
        const top = rgba(isLight ? darken(0.1, base) : lighten(0.05, base), 0.9);
        const mid = rgba(base, 0.85);
        const bottom = rgba(isLight ? darken(0.1, base) : lighten(0.1, base), 0.9);
        return [top, mid, bottom];
    }, [base, isLight]);


    return (
        <LinearGradient
            fullscreen
            pointerEvents="none"
            start={START}
            end={END}
            colors={colors}
            {...rest}
        />

    );
}, (prev, next) => {
    // super-cheap compare; if you pass dynamic props into the gradient, consider
    // comparing only the ones you actually use (token, start/end/colors/locations/etc.)
    return prev.token === next.token;
});


