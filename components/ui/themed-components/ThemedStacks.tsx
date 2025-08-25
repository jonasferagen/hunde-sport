// ThemedStacks.tsx
import { rgba } from 'polished';
import { ComponentProps, ComponentRef, forwardRef, ReactNode } from 'react';
import { getVariableValue, SizeTokens, Stack, StackProps, styled, ThemeName, useTheme, XStack, XStackProps, YStack, YStackProps } from 'tamagui';

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
            (alpha: number, { theme }: { theme: any }) => {
                const tokenValue = theme['background'];
                const base = String(getVariableValue(tokenValue)); // resolve $background
                const a = Math.max(0, Math.min(1, Number(alpha) || 0));   // clamp 0..1
                return { bg: rgba(base, a) };
            },
    }
} as const;

const ThemedStackBase = styled(Stack, config);
const ThemedYStackBase = styled(YStack, config);
const ThemedXStackBase = styled(XStack, config);

type Props = { bgOpacity?: number };
type WithChildren<P> = Omit<P, 'children'> & { children?: ReactNode };

export type ThemedStackProps = WithChildren<ComponentProps<typeof ThemedYStackBase> & StackProps & Props>;
export const ThemedStack = forwardRef<ComponentRef<typeof ThemedStackBase>, ThemedStackProps>(
    (props, ref) => <ThemedStackBase ref={ref} {...props} />
);

export type ThemedYStackProps = WithChildren<ComponentProps<typeof ThemedYStackBase> & YStackProps & Props>;
export const ThemedYStack = forwardRef<ComponentRef<typeof ThemedYStackBase>, ThemedYStackProps>(
    (props, ref) => <ThemedYStackBase ref={ref} {...props} />
);

export type ThemedXStackProps = WithChildren<ComponentProps<typeof ThemedXStackBase> & XStackProps & Props>;
export const ThemedXStack = forwardRef<ComponentRef<typeof ThemedXStackBase>, ThemedXStackProps>(
    (props, ref) => <ThemedXStackBase ref={ref} {...props} />
);
