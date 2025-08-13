import { forwardRef, ReactNode } from 'react';
import { styled, XStack, YStack } from 'tamagui';

const config = {
    name: 'ThemedYStack',

    // base
    p: 0,                 // use 0 or '$0'
    gap: '$3',
    boc: '$borderColor',
    bg: 'transparent',

    variants: {
        preset: {
            none: {},
            container: { p: '$3', gap: '$3' },
            tight: { p: '$2', gap: '$2' },
            loose: { p: '$4', gap: '$4' },
        },
    },

    defaultVariants: {
        preset: 'none',
    },
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