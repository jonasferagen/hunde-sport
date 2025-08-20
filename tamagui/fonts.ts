// fonts.ts
import { createFont } from 'tamagui'

// Same base size scale Tamagui uses (includes 1–16 + `true` alias)
const baseSizes = {
    1: 11,
    2: 12,
    3: 13,
    4: 14,
    true: 14 as const, // alias used by some components
    5: 16,
    6: 18,
    7: 20,
    8: 23,
    9: 30,
    10: 46,
    11: 55,
    12: 62,
    13: 72,
    14: 92,
    15: 114,
    16: 134,
} as const

// Simple line-height function (what the Inter preset does by default)
const makeLineHeights = (sizes: Record<number, number>) =>
    Object.fromEntries(Object.entries(sizes).map(([k, v]) => [k, (v as number) + 10])) as Record<
        keyof typeof sizes,
        number
    >

// INTER: Regular (400) + Bold (700)
export const interFont = createFont({
    family: 'Inter',
    size: baseSizes,
    lineHeight: makeLineHeights(baseSizes),
    // Only two weights needed, but define both explicitly
    weight: {
        1: '400', 2: '400', 3: '400', 4: '400', 5: '400',
        6: '700', 7: '700', 8: '700', 9: '700', 10: '700',
        11: '700', 12: '700', 13: '700', 14: '700', 15: '700', 16: '700',
    },
    letterSpacing: { 4: 0 }, // optional; keep default behavior
    face: {
        400: { normal: 'Inter' },        // useFonts key for Regular
        700: { normal: 'Inter-Bold' },   // useFonts key for Bold
    },
})

// MONTSERRAT: Regular (400) + Bold (700)
export const montserratFont = createFont({
    family: 'Montserrat',
    size: baseSizes,
    lineHeight: makeLineHeights(baseSizes),
    weight: {
        1: '400', 2: '400', 3: '400', 4: '400', 5: '400',
        6: '700', 7: '700', 8: '700', 9: '700', 10: '700',
        11: '700', 12: '700', 13: '700', 14: '700', 15: '700', 16: '700',
    },
    face: {
        400: { normal: 'Montserrat' },
        700: { normal: 'Montserrat-Bold' },
    },
})
