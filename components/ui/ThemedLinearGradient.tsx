import { LinearGradient } from '@tamagui/linear-gradient';
import { darken, lighten } from 'polished';
import type { ComponentProps } from 'react';
import { JSX, useMemo } from 'react';
import { useTheme } from 'tamagui';

interface ThemedLinearGradientProps
    extends Omit<ComponentProps<typeof LinearGradient>, 'start' | 'end' | 'colors'> {
    startPoint?: [number, number];
    endPoint?: [number, number];
    colors?: (string | any)[];
    strong?: boolean;
    elevated?: boolean;
}



export const ThemedLinearGradient = ({
    startPoint = [0, 0],
    endPoint = [1, 1],
    strong = false,
    elevated = false,
    ...props
}: ThemedLinearGradientProps): JSX.Element => {

    const theme = useTheme();
    const baseColor = theme.background.get();
    const from = elevated ? lighten(.1, baseColor) : baseColor;

    const value = strong ? .2 : .1;

    const to = darken(value, baseColor);

    const colors = [from, to];

    return useMemo(() => (
        <LinearGradient
            fullscreen
            start={startPoint}
            end={endPoint}
            $group-focus={{ opacity: 0 }}
            colors={colors}
            {...props}
        />
    ), [colors, startPoint, endPoint]);
};
