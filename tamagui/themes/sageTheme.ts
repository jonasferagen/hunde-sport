// themeBuilder.ts
import { createThemeBuilder } from '@tamagui/theme-builder'
import { darken, lighten } from 'polished'

const light_base = '#DDE2C3'
const dark_base = '#24301A'

const NEUTRALS = {
    light: '#F1F5F9', // slate-50
    dark: '#0B1320', // deep slate/blue-black
}

// --- Palettes --------------------------------------------------------------
// Keep a consistent index for the "neutral background" (index 0) so a child
// template can target it across both light and dark.
const makeLightPalette = (base: string, neutral: string) => ([
    neutral,                 // 0: neutral bg (used by child theme "neutral")
    lighten(0.06, base),     // 1
    base,                    // 2: base bg
    darken(0.06, base),      // 3: hover
    darken(0.12, base),      // 4: press
    darken(0.18, base),      // 5: focus
    '#0a0a0a',               // 6: very dark (good for text with -1 index)
])

const makeDarkPalette = (base: string, neutral: string) => ([
    neutral,                 // 0: neutral bg (dark version)
    darken(0.06, base),      // 1
    base,                    // 2: base bg
    lighten(0.06, base),     // 3: hover
    lighten(0.12, base),     // 4: press
    lighten(0.18, base),     // 5: focus
    '#ffffff',               // 6: very light (good for text with -1 index)
])

const palettes = {
    light: makeLightPalette(light_base, NEUTRALS.light),
    dark: makeDarkPalette(dark_base, NEUTRALS.dark),
}

// --- Templates -------------------------------------------------------------
// Use the same slots across templates so child themes only swap indices.
const templates = {
    base: {
        background: 2,
        backgroundHover: 3,
        backgroundPress: 4,
        backgroundFocus: 5,
        color: -1,                // pick from the opposite end for contrast
        colorHover: -1,
        colorPress: -1,
        colorFocus: -1,
        borderColor: 4,
        borderColorHover: 3,
        borderColorPress: 5,
    },
    subtle: {
        background: 1,
        backgroundHover: 2,
        backgroundPress: 3,
        backgroundFocus: 4,
        color: -1,
        borderColor: 3,
    },
    // Neutral child: backgrounds come from the NEUTRALS slot (index 0)
    neutral: {
        background: 0,
        backgroundHover: 1,
        backgroundPress: 2,
        backgroundFocus: 3,
        color: -1,
        borderColor: 2,
    },
} as const

// --- Build -----------------------------------------------------------------
const themesBuilder = createThemeBuilder()
    .addPalettes(palettes)
    .addTemplates(templates)
    .addThemes({
        light: { template: 'base', palette: 'light' },
        dark: { template: 'base', palette: 'dark' },
    })
    .addChildThemes({
        subtle: { template: 'subtle' },
        neutral: { template: 'neutral' },
    })

export const themes = themesBuilder.build()

// Optional: a handy type + names for <Theme name="...">
export type AppThemeName =
    | 'light' | 'dark'
    | 'light_subtle' | 'dark_subtle'
    | 'light_neutral' | 'dark_neutral'

export const themeNames = [
    'light', 'dark',
    'light_subtle', 'dark_subtle',
    'light_neutral', 'dark_neutral',
] as const
