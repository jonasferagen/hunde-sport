// themeFactory.ts
import { darken, getLuminance, lighten, rgba } from 'polished'

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
export type PaletteConfig = Record<string, { light: string; dark: string }>

/** Variant suffixes we generate per palette key */
type VariantSuffix = '' | '_tint' | '_shade'
type BaseKey<C> = Extract<keyof C, string>

/** Nice typed theme-name union from the config you pass in */
export type ThemeNames<C extends PaletteConfig> =
    | 'light'
    | 'dark'
    | `${'light' | 'dark'}_${BaseKey<C>}`
    | `${'light' | 'dark'}_${BaseKey<C>}_tint`
    | `${'light' | 'dark'}_${BaseKey<C>}_shade`

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
    shadowFocusDelta: 0.1,

    // NEW: strengths for tint/shade variants
    tint: 0.12,  // lighten by 12%
    shade: 0.15, // darken by 15%
}

/**
 * Build a single theme surface from a base color.
 * Text flips to black/white for contrast. Hover/Press/Focus go darker on light
 * bases and lighter on dark bases for consistent perceived depth.
 */
export function makeTemplate(base: string): ThemeTemplate {
    const isLightBg = getLuminance(base) > 0.5
    const text = isLightBg ? '#000000' : '#FFFFFF'

    const step = (amt: number) => (isLightBg ? darken(amt, base) : lighten(amt, base))

    // Borders: derive from base, darker on light, lighter on dark
    const borderBase = isLightBg ? darken(AMOUNTS.borderBase, base) : lighten(AMOUNTS.borderBase, base)
    const borderStep = (amt: number) => (isLightBg ? darken(amt, borderBase) : lighten(amt, borderBase))

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

/** Apply variant adjustment to a base color */
function variantBase(base: string, variant: '' | '_tint' | '_shade'): string {
    if (variant === '_tint') return lighten(AMOUNTS.tint, base)
    if (variant === '_shade') return darken(AMOUNTS.shade, base)
    return base
}

/** Generate base/tint/shade templates for a single color */
function makeVariantSet(base: string) {
    return {
        '': makeTemplate(variantBase(base, '')),
        _tint: makeTemplate(variantBase(base, '_tint')),
        _shade: makeTemplate(variantBase(base, '_shade')),
    } as const
}

/**
 * Build a flat set of themes like (per key):
 *  - light_key, light_key_tint, light_key_shade
 *  - dark_key,  dark_key_tint,  dark_key_shade
 * (No extra nesting; you attach them directly under Tamagui's light/dark.)
 */
export function buildThemes<C extends PaletteConfig>(config: C): {
    themes: Record<ThemeNames<C>, ThemeTemplate>
    themeNames: ThemeNames<C>[]
} {
    const themes = {} as Record<ThemeNames<C>, ThemeTemplate>

    for (const key of Object.keys(config) as Array<BaseKey<C>>) {
        const { light, dark } = config[key]

        const lightSet = makeVariantSet(light)
        const darkSet = makeVariantSet(dark)

        // base/tint/shade for light
        themes[`light_${key}` as ThemeNames<C>] = lightSet['']
        themes[`light_${key}_tint` as ThemeNames<C>] = lightSet['_tint']
        themes[`light_${key}_shade` as ThemeNames<C>] = lightSet['_shade']

        // base/tint/shade for dark
        themes[`dark_${key}` as ThemeNames<C>] = darkSet['']
        themes[`dark_${key}_tint` as ThemeNames<C>] = darkSet['_tint']
        themes[`dark_${key}_shade` as ThemeNames<C>] = darkSet['_shade']
    }

    // Optional roots:
    // themes.light = makeTemplate('#FFFFFF' as any)
    // themes.dark  = makeTemplate('#111111' as any)

    const themeNames = Object.keys(themes) as ThemeNames<C>[]
    return { themes, themeNames }
}
