// themeFactory.ts
import {
    darken,
    getLuminance,
    lighten,
    rgba,
} from 'polished'

/** The token surface your components expect */
export type ThemeTemplate = {
    background: string
    backgroundFocus: string
    backgroundHover: string
    backgroundPress: string

    borderColor: string
    borderColorFocus: string
    borderColorHover: string
    borderColorPress: string

    color: string
    colorFocus: string
    colorHover: string
    colorPress: string
    colorTransparent: string

    placeholderColor: string

    shadowColor: string
    shadowColorFocus: string
    shadowColorHover: string
    shadowColorPress: string
}

/** Your input config */
export type PaletteConfig = Record<
    string,
    { light: string; dark: string }
>

/** Nice typed theme-name union from the config you pass in */
export type ThemeNames<C extends PaletteConfig> =
    | 'light'
    | 'dark'
    | `light_${Extract<keyof C, string>}`
    | `dark_${Extract<keyof C, string>}`

/** Tunables in one spot */
const AMOUNTS = {
    hover: 0.04,
    press: 0.09,
    focus: 0.12,
    borderBase: 0.18,
    borderHover: 0.04,
    borderPress: 0.08,
    textTransparent: 0.55,
    placeholder: 0.5,
    shadowBase: (isLightBg: boolean) => (isLightBg ? 0.28 : 0.6),
    shadowHoverDelta: 0.06,
    shadowPressDelta: 0.12,
    shadowFocusDelta: 0.10,
}

/**
 * Build a single theme surface from a base color.
 * Text flips to black/white for contrast. Hover/Press/Focus go darker on light
 * bases and lighter on dark bases for consistent perceived depth.
 */
export function makeTemplate(base: string): ThemeTemplate {
    const isLightBg = getLuminance(base) > 0.5
    const text = isLightBg ? '#000000' : '#FFFFFF'

    const step = (amt: number) =>
        isLightBg ? darken(amt, base) : lighten(amt, base)

    // Darken borders anyway

    const borderBase = true || isLightBg ? darken(AMOUNTS.borderBase, base)
        : lighten(AMOUNTS.borderBase, base)

    const borderStep = (amt: number) =>
        true || isLightBg ? darken(amt, borderBase) : lighten(amt, borderBase)

    const shadowAlpha = AMOUNTS.shadowBase(isLightBg)

    return {
        // background surface
        background: base,
        backgroundHover: step(AMOUNTS.hover),
        backgroundPress: step(AMOUNTS.press),
        backgroundFocus: step(AMOUNTS.focus),

        // borders track background but a bit stronger for clarity
        borderColor: borderBase,
        borderColorHover: borderStep(AMOUNTS.borderHover),
        borderColorPress: borderStep(AMOUNTS.borderPress),
        borderColorFocus: rgba(isLightBg ? '#000' : '#FFF', 0.35),

        // text colors
        color: text,
        colorHover: text,
        colorPress: text,
        colorFocus: text,
        colorTransparent: rgba(text, AMOUNTS.textTransparent),

        // inputs / subtle text
        placeholderColor: rgba(text, AMOUNTS.placeholder),

        // shadows: darker alpha on dark bg so elevation reads
        shadowColor: rgba('#000', shadowAlpha),
        shadowColorHover: rgba('#000', Math.min(1, shadowAlpha + AMOUNTS.shadowHoverDelta)),
        shadowColorPress: rgba('#000', Math.min(1, shadowAlpha + AMOUNTS.shadowPressDelta)),
        shadowColorFocus: rgba('#000', Math.min(1, shadowAlpha + AMOUNTS.shadowFocusDelta)),
    }
}

/**
 * Build a flat set of themes like:
 *  - light_primary, dark_primary
 *  - light_secondary, dark_secondary
 *  - ...
 * (No extra nesting; you attach them directly under Tamagui's light/dark.)
 */
export function buildThemes<C extends PaletteConfig>(config: C) {
    const themes: Record<string, ThemeTemplate> = {}

    for (const key of Object.keys(config) as Array<keyof C & string>) {
        const { light, dark } = config[key]
        themes[`light_${key}`] = makeTemplate(light)
        themes[`dark_${key}`] = makeTemplate(dark)
    }

    // If you want to override/define root light/dark, add them here.
    // (Otherwise rely on defaultConfig.themes for the roots.)
    // Example (optional):
    // themes.light = makeTemplate(config.tertiary?.light ?? '#FFFFFF')
    // themes.dark  = makeTemplate(config.tertiary?.dark  ?? '#111111')

    const themeNames = Object.keys(themes)

    return { themes, themeNames }
}
