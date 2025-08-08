import { LinearGradient } from '@tamagui/linear-gradient';
import type { ComponentProps } from 'react';
import { JSX } from 'react';

interface ThemedLinearGradientProps
    extends Omit<ComponentProps<typeof LinearGradient>, 'start' | 'end' | 'colors'> {
    startPoint?: [number, number];
    endPoint?: [number, number];
    colors?: (string | any)[];
    strong?: boolean;
}

export const ThemedLinearGradient = ({
    startPoint = [0, 0],
    endPoint = [1, 1],
    colors = ['$background', '$backgroundPress'],
    strong = false,
    ...props
}: ThemedLinearGradientProps): JSX.Element => {
    return (
        <LinearGradient
            fullscreen
            start={startPoint}
            end={endPoint}
            colors={strong ? ['$backgroundStrong', '$backgroundPress'] : colors}
            $group-focus={{ opacity: 0 }}
            {...props}
        />
    );
};
