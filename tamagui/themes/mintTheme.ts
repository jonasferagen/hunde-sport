/*
import { darken } from "polished"
import { createAppThemes, ThemeFactoryConfig } from "./themeFactoryPrev"

// your config (pairs for light/dark)
const config = {
    base: { light: '#C8E6E5', dark: '#24301A' },
    alt: { light: '#DDE2C3', dark: '#24301A' },
    neutral: { light: '#F1F5F9', dark: '#0B1320' },
    accents: {
        primary: { light: darken(0.1, '#608f39'), dark: '#608f39' },
        secondary: { light: '#334524', dark: '#334524' },
    },
    status: {
        success: { light: '#16A34A', dark: '#34D399' },
        info: { light: '#0891B2', dark: '#22D3EE' },
        danger: { light: '#DC2626', dark: '#F87171' },
    },

} satisfies ThemeFactoryConfig

export const mintTheme = createAppThemes(config)
*/
//const lilacColor = '#D7C8E7'

/// themes/appThemes.ts
import { buildThemes } from './themeFactory'

export const config = {
    primary: { light: '#C8E6E5', dark: '#24301A' },
    secondary: { light: '#DDE2C3', dark: '#24301A' },
    tertiary: { light: '#F1F5F9', dark: '#0B1320' },
    accent1: { light: '#608f39', dark: '#608f39' },
    accent2: { light: '#334524', dark: '#334524' },
    accent3: { light: '#608f39', dark: '#608f39' },
} as const

export const mintTheme = buildThemes(config)


// Optional: handy type for <Theme name="...">
export type AppThemeName =
    | `light_${keyof typeof config & string}`
    | `dark_${keyof typeof config & string}`