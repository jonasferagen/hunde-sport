// themeBuilder.ts
import { createThemeBuilder } from '@tamagui/theme-builder'
import { darken, lighten } from 'polished'

const light_base = '#DDE2C3'
const dark_base = '#24301A'

const NEUTRALS = {
    light: '#F1F5F9', // slate-50
    dark: '#0B1320', // deep slate/blue-black
}

// ----- Palettes (ordered from lighter -> darker; last slot is always "text") -----
const makeLightPalette = (base: string) => ([
    NEUTRALS.light,          // 0 neutral bg (very light)
    lighten(0.12, base),     // 1
    lighten(0.06, base),     // 2
    base,                    // 3 (base)
    darken(0.06, base),      // 4
    darken(0.12, base),      // 5
    '#0a0a0a',               // 6 high-contrast text for light
])

const makeDarkPalette = (base: string) => ([
    lighten(0.24, base),     // 0 lightest tint
    lighten(0.18, base),     // 1
    lighten(0.12, base),     // 2
    base,                    // 3 (base)
    darken(0.06, base),      // 4
    darken(0.12, base),      // 5
    '#ffffff',               // 6 high-contrast text for dark
])

const palettes = {
    light: makeLightPalette(light_base),
    dark: makeDarkPalette(dark_base),
}

type Template = Record<string, number>

// reserve last index for text only; don’t let backgrounds pick it
const MAX_BG_INDEX = palettes.light.length - 2 // 5 with above palettes

// Shift helper: moves only non-negative indices and clamps within [0, MAX_BG_INDEX]
const shiftTemplate = (tmpl: Template, delta: number): Template => {
    const out: Template = {}
    for (const [k, v] of Object.entries(tmpl)) {
        if (typeof v === 'number' && v >= 0) {
            const n = Math.max(0, Math.min(MAX_BG_INDEX, v + delta))
            out[k] = n
        } else {
            // keep negatives (like -1 for “end of palette” text color) as-is
            out[k] = v as number
        }
    }
    return out
}

// ----- Base templates -----
const baseTemplate = {
    background: 3,
    backgroundHover: 4,
    backgroundPress: 5,
    backgroundFocus: 4,
    color: -1,               // pick “text” slot (last index)
    colorHover: -1,
    colorPress: -1,
    colorFocus: -1,
    borderColor: 4,
    borderColorHover: 4,
    borderColorPress: 5,
} as const

const subtleTemplate = {
    background: 2,
    backgroundHover: 3,
    backgroundPress: 4,
    backgroundFocus: 3,
    color: -1,
    borderColor: 3,
} as const

const neutralTemplate = {
    background: 0,           // use the neutral slot
    backgroundHover: 1,
    backgroundPress: 2,
    backgroundFocus: 1,
    color: -1,
    borderColor: 2,
} as const

// ----- Tint/Shade variants (level 1 and 2) -----
// tint  = lighter  (shift left = -1 / -2)
// shade = darker   (shift right = +1 / +2)
const templates = {
    base: baseTemplate,
    subtle: subtleTemplate,
    neutral: neutralTemplate,

    // From base
    tint: shiftTemplate(baseTemplate, -1),
    tint2: shiftTemplate(baseTemplate, -2),
    shade: shiftTemplate(baseTemplate, +1),
    shade2: shiftTemplate(baseTemplate, +2),

    // Optional: if you want tint/shade that start from "subtle" instead of "base"
    subtle_tint: shiftTemplate(subtleTemplate, -1),
    subtle_tint2: shiftTemplate(subtleTemplate, -2),
    subtle_shade: shiftTemplate(subtleTemplate, +1),
    subtle_shade2: shiftTemplate(subtleTemplate, +2),

    // Optional: neutral-driven tint/shade (will step away from the neutral slot)
    neutral_tint: shiftTemplate(neutralTemplate, -1),
    neutral_tint2: shiftTemplate(neutralTemplate, -2),
    neutral_shade: shiftTemplate(neutralTemplate, +1),
    neutral_shade2: shiftTemplate(neutralTemplate, +2),
} as const

// ----- Build -----
const themesBuilder = createThemeBuilder()
    .addPalettes(palettes)
    .addTemplates(templates)
    // Base light/dark
    .addThemes({
        light: { template: 'base', palette: 'light' },
        dark: { template: 'base', palette: 'dark' },
    })
    // Base child themes
    .addChildThemes({
        subtle: { template: 'subtle' },
        neutral: { template: 'neutral' },
    })
    // Global tint/shade (from base)
    .addChildThemes({
        tint: { template: 'tint' },
        tint2: { template: 'tint2' },
        shade: { template: 'shade' },
        shade2: { template: 'shade2' },
    })
    // (Optional) enable chaining from subtle/neutral specifically
    .addChildThemes({
        subtle_tint: { template: 'subtle_tint' },
        subtle_tint2: { template: 'subtle_tint2' },
        subtle_shade: { template: 'subtle_shade' },
        subtle_shade2: { template: 'subtle_shade2' },
        neutral_tint: { template: 'neutral_tint' },
        neutral_tint2: { template: 'neutral_tint2' },
        neutral_shade: { template: 'neutral_shade' },
        neutral_shade2: { template: 'neutral_shade2' },
    })

export const themes = themesBuilder.build()

// For nice TS autocomplete on <Theme name="...">
export type AppThemeName =
    | 'light' | 'dark'
    | 'light_subtle' | 'dark_subtle'
    | 'light_neutral' | 'dark_neutral'
    | 'light_tint' | 'dark_tint'
    | 'light_tint2' | 'dark_tint2'
    | 'light_shade' | 'dark_shade'
    | 'light_shade2' | 'dark_shade2'
    | 'light_subtle_tint' | 'dark_subtle_tint'
    | 'light_subtle_tint2' | 'dark_subtle_tint2'
    | 'light_subtle_shade' | 'dark_subtle_shade'
    | 'light_subtle_shade2' | 'dark_subtle_shade2'
    | 'light_neutral_tint' | 'dark_neutral_tint'
    | 'light_neutral_tint2' | 'dark_neutral_tint2'
    | 'light_neutral_shade' | 'dark_neutral_shade'
    | 'light_neutral_shade2' | 'dark_neutral_shade2'

export const themeNames: readonly AppThemeName[] = [
    'light', 'dark',
    'light_subtle', 'dark_subtle',
    'light_neutral', 'dark_neutral',
    'light_tint', 'dark_tint',
    'light_tint2', 'dark_tint2',
    'light_shade', 'dark_shade',
    'light_shade2', 'dark_shade2',
    'light_subtle_tint', 'dark_subtle_tint',
    'light_subtle_tint2', 'dark_subtle_tint2',
    'light_subtle_shade', 'dark_subtle_shade',
    'light_subtle_shade2', 'dark_subtle_shade2',
    'light_neutral_tint', 'dark_neutral_tint',
    'light_neutral_tint2', 'dark_neutral_tint2',
    'light_neutral_shade', 'dark_neutral_shade',
    'light_neutral_shade2', 'dark_neutral_shade2',
] as const
