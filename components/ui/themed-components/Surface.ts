// surface.ts
import { styled, View } from 'tamagui'

// everything here is theme-token driven and interaction-ready
const surfaceBase = {
    name: 'Surface',
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

    hoverStyle: { bg: '$backgroundHover', boc: '$borderColor' },
    pressStyle: { bg: '$backgroundPress', boc: '$borderColor' },
    focusStyle: {
        bg: '$backgroundFocus',
        boc: '$borderColor',
        outlineWidth: 2,
        outlineStyle: 'solid',
    },
} as const

export const Surface = styled(View, surfaceBase)
