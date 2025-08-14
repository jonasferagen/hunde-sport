import { LinearGradient } from '@tamagui/linear-gradient';
import { darken, lighten } from 'polished';
import React, { JSX } from 'react';
import { useTheme, useThemeName } from 'tamagui';



const propsAreEqual = (prevProps: ThemedLinearGradientProps, nextProps: ThemedLinearGradientProps) => {
    return prevProps.strong === nextProps.strong &&
        prevProps.elevated === nextProps.elevated &&
        prevProps.flip === nextProps.flip &&
        prevProps.colors === nextProps.colors;
};

interface ThemedLinearGradientProps {
    strong?: boolean;
    elevated?: boolean;
    flip?: boolean;
    [key: string]: any;
}

export const ThemedLinearGradient = React.memo(function ThemedLinearGradient({

    strong = false,
    elevated = false,
    flip = false,
    ...props
}: ThemedLinearGradientProps): JSX.Element {


    const startPoint = [0, 0];
    const endPoint = [1, 1];
    const theme = useTheme();
    const themeName = useThemeName(); // helps when theme objects are proxies


    // Base color string (stable primitive)
    const baseColor = React.useMemo(() => {
        // `.get()` returns a string; if theme changes, themeName changes too
        return theme.background?.get?.() ?? '#fff';
    }, [themeName]); // depend on themeName for clarity

    // Derived colors (cheap but now referentially stable)
    const colors = React.useMemo(() => {
        const from = elevated ? lighten(0.1, baseColor) : baseColor;
        const amount = strong ? 0.2 : 0.1;
        const to = darken(amount, baseColor);
        return (flip ? [to, from] : [from, to]) as [string, string];
    }, [baseColor, elevated, strong, flip]);

    // Normalize point array identities (avoid new arrays causing rerenders downstream)
    const start = React.useMemo<[number, number]>(() => [startPoint[0], startPoint[1]], [startPoint[0], startPoint[1]]);
    const end = React.useMemo<[number, number]>(() => [endPoint[0], endPoint[1]], [endPoint[0], endPoint[1]]);

    // No need to memoize the JSX; React.memo on the component handles skipping rerenders
    return (
        <LinearGradient
            fullscreen
            start={start}
            end={end}
            pointerEvents="none"
            colors={colors}
            {...props}
        />
    );
}, propsAreEqual);


