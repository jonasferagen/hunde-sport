import { forwardRef, ReactNode } from 'react';
import { SizeTokens, styled, XStack, YStack } from 'tamagui';

const DEFAULT_SIZE = '$3';

const config = {
    name: 'ThemedYStack',
    p: 0,
    gap: DEFAULT_SIZE,
    boc: '$borderColor',
    bg: 'transparent',

    variants: {
        container: {
            true: { p: DEFAULT_SIZE, gap: DEFAULT_SIZE },
            '...size': (size: SizeTokens) => ({ p: size, gap: size }),
        },
        split: {
            true: { ai: 'center', jc: 'space-between' },
        },
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