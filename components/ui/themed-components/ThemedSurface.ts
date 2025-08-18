// surface.ts
import { View, styled } from 'tamagui';

const PRESS_STYLE = { boc: '$borderColorInverse', bg: '$backgroundInverse', opacity: 0.7 } as const;

export const ThemedSurface = styled(View, {
    name: 'ThemedSurface',
    ov: 'hidden',
    br: '$3',
    bw: '$borderWidth',
    boc: '$borderColor',
    bg: '$background',
    shadowColor: '$shadowColor',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // NOTE: leave 'animation' off by default to avoid animating every style change
    // animation: 'fast',

    variants: {
        interactive: {
            true: {
                // only attach interactive styles when explicitly enabled
                pressStyle: PRESS_STYLE,
                hoverStyle: { bg: '$backgroundHover', boc: '$borderColorHover', opacity: 0.7 },
                focusStyle: {
                    bg: '$backgroundFocus',
                    boc: '$borderColorFocus',
                    outlineWidth: 2,
                    outlineStyle: 'solid',
                },
                // if you *want* animated transitions for interactive tiles, add it here:
                // animation: 'fast',
            },
            false: {
                // explicitly no interactive styles
                pressStyle: undefined,
                hoverStyle: undefined,
                focusStyle: undefined,
                // and keep animations off
                animation: undefined,
            },
        },
    },

    defaultVariants: {
        interactive: false,   // <- inert by default
    },
});