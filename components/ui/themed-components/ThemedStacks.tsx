// ThemedStacks.tsx
import { rgba } from 'polished';
import { forwardRef, ReactNode } from 'react';
import { getVariableValue, SizeTokens, styled, useTheme, XStack, YStack } from 'tamagui';

const DEFAULT_SIZE = '$3';

const config = {
    name: 'ThemedStack',
    gap: DEFAULT_SIZE,
    boc: '$borderColor',
    bg: 'transparent',
    pos: 'relative',
    p: 0,

    variants: {
        container: {
            true: { p: DEFAULT_SIZE, gap: DEFAULT_SIZE },
            '...size': (size: SizeTokens) => ({ p: size, gap: size }),
        },
        split: { true: { ai: 'center', jc: 'space-between' } },
        pressable: { true: { pressStyle: { opacity: 0.7 } } },
        box: { true: { bw: 0, boc: '$borderColor', bg: '$background' } },
        rounded: { true: { br: '$3' } },
        bgOpacity:
            (alpha: number) => {
                const theme = useTheme();
                const tokenValue = theme['background'];
                const base = String(getVariableValue(tokenValue)); // resolve $background
                const a = Math.max(0, Math.min(1, Number(alpha) || 0));   // clamp 0..1

                console.log(rgba(base, a));
                return { bg: rgba(base, a) };
            },
    }
} as const;

const ThemedYStackBase = styled(YStack, config);
const ThemedXStackBase = styled(XStack, config);
type Props = { bgOpacity?: number };
type WithChildren<P> = Omit<P, 'children'> & { children?: ReactNode };

export const ThemedYStack = forwardRef<any, WithChildren<React.ComponentProps<typeof ThemedYStackBase> & Props>>(
    (props, ref) => <ThemedYStackBase ref={ref} {...props} />
);

export const ThemedXStack = forwardRef<any, WithChildren<React.ComponentProps<typeof ThemedXStackBase> & Props>>(
    (props, ref) => <ThemedXStackBase ref={ref} {...props} />
);
