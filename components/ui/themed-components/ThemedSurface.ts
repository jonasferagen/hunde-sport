// surface.ts
import { View, styled } from 'tamagui';

// everything here is theme-token driven and interaction-ready
const surface = {
    name: 'ThemedSurface',
    ov: 'hidden',
    br: '$3',
    bw: '$borderWidth',
    boc: '$borderColor',
    bg: '$background',

    // “button-ish” affordances
    shadowColor: '$shadowColor',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    animation: 'fast',
    hoverStyle: { bg: '$backgroundHover', boc: '$borderColorHover', opacity: 0.7 },
    pressStyle: { bg: '$backgroundPress', boc: '$borderColorPress', opacity: 0.7 },
    focusStyle: {
        bg: '$backgroundFocus',
        boc: '$borderColorFocus',
        outlineWidth: 2,
        outlineStyle: 'solid',
    },
} as const

export const ThemedSurface = styled(View, surface)
