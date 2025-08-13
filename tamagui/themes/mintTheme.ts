import { createAppThemes, ThemeFactoryConfig } from "./themeFactory"

// your config (pairs for light/dark)
const config = {
    base: { light: '#C8E6E5', dark: '#24301A' },
    alt: { light: '#DDE2C3', dark: '#24301A' },
    neutral: { light: '#F1F5F9', dark: '#0B1320' },
    accents: {
        primary: { light: '#2563EB', dark: '#60A5FA' },   // blue, brighter on dark
        secondary: { light: '#8B5CF6', dark: '#C4B5FD' },   // violet
    },
    status: {
        success: { light: '#16A34A', dark: '#34D399' },
        info: { light: '#0891B2', dark: '#22D3EE' },
        danger: { light: '#DC2626', dark: '#F87171' },
    },
    // optional: tweak ramp strengths or disable tint/shade
    // includeTintShade: false,
} satisfies ThemeFactoryConfig

export const mintTheme = createAppThemes(config)

//const lilacColor = '#D7C8E7'

