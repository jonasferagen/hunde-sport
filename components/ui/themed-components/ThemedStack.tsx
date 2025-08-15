import { forwardRef, ReactNode } from 'react';
import { SizeTokens, styled, XStack, YStack } from 'tamagui';

const DEFAULT_SIZE = '$3';

const config = {
    name: 'ThemedStack',
    p: 0,
    gap: DEFAULT_SIZE,
    boc: '$borderColor',
    bg: 'transparent',
    pos: 'relative',

    variants: {
        container: {
            true: { p: DEFAULT_SIZE, gap: DEFAULT_SIZE },
            '...size': (size: SizeTokens) => ({ p: size, gap: size }),
        },
        split: {
            true: { ai: 'center', jc: 'space-between' },
        },
        pressable: {
            true: { pressStyle: { opacity: 0.7 } },
        },
        box: {
            true: { bw: 0, boc: '$borderColor', bg: '$background' },
        },
        rounded: {
            true: { br: '$3' },
        },
        chip: {
            true: {
                fs: 1,
                bw: 1,
                px: '$2',
                py: '$1',
                br: '$3',
                ov: 'hidden',
                ai: 'center',
                jc: 'center',
                gap: '$1.5'
            },
        }

    }
} as const



// your styled base (as you already made it)
const ThemedYStackBase = styled(YStack, config);
const ThemedXStackBase = styled(XStack, config);

// Re-add children typing via a tiny wrapper
type WithChildren<P> = Omit<P, 'children'> & { children?: ReactNode };

export const ThemedYStack = forwardRef<any, WithChildren<React.ComponentProps<typeof ThemedYStackBase>>>(
    (props, ref) => <ThemedYStackBase ref={ref} {...props} />
);

export const ThemedXStack = forwardRef<any, WithChildren<React.ComponentProps<typeof ThemedXStackBase>>>(
    (props, ref) => <ThemedXStackBase ref={ref} {...props} />
);