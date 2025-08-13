// themeFactory.ts
import { createThemeBuilder } from '@tamagui/theme-builder';
import { darken, lighten } from 'polished';

type ColorPair = { light: string; dark: string }

export type ThemeFactoryConfig = {
    base: ColorPair                      // app surface bases
    neutral: ColorPair                   // neutral background slot
    text?: {
        strong?: ColorPair                 // defaults: #000 / #fff
        subtle?: ColorPair                 // defaults: slate-ish
    }
    accents: {
        primary: ColorPair
        secondary: ColorPair
    }
    status?: {
        success?: ColorPair
        info?: ColorPair
        danger?: ColorPair
    }
    // Optional: tweak ramp strength
    ramps?: {
        baseLight?: { up1?: number; up2?: number; down1?: number; down2?: number }
        baseDark?: { up1?: number; up2?: number; down1?: number; down2?: number }
        accentLight?: { up2?: number; up1?: number; down1?: number; down2?: number }
        accentDark?: { up2?: number; up1?: number; down1?: number; down2?: number }
    }
    includeTintShade?: boolean           // default true
}

const DEFAULTS = {
    textStrong: { light: '#000000', dark: '#FFFFFF' },
    textSubtle: { light: '#334155', dark: '#E5E7EB' },
    ramps: {
        baseLight: { up2: 0.12, up1: 0.06, down1: 0.06, down2: 0.12 },
        baseDark: { up2: 0.18, up1: 0.12, down1: 0.06, down2: 0.12 },
        accentLight: { up2: 0.18, up1: 0.09, down1: 0.08, down2: 0.16 },
        accentDark: { up2: 0.24, up1: 0.16, down1: 0.08, down2: 0.16 },
    },
} as const

type Template = Record<string, number>

export function createAppThemes(cfg: ThemeFactoryConfig) {
    const ramps = {
        baseLight: { ...DEFAULTS.ramps.baseLight, ...(cfg.ramps?.baseLight ?? {}) },
        baseDark: { ...DEFAULTS.ramps.baseDark, ...(cfg.ramps?.baseDark ?? {}) },
        accentLight: { ...DEFAULTS.ramps.accentLight, ...(cfg.ramps?.accentLight ?? {}) },
        accentDark: { ...DEFAULTS.ramps.accentDark, ...(cfg.ramps?.accentDark ?? {}) },
    }

    const textStrong: ColorPair = {
        light: cfg.text?.strong?.light ?? DEFAULTS.textStrong.light,
        dark: cfg.text?.strong?.dark ?? DEFAULTS.textStrong.dark,
    }
    const textSubtle: ColorPair = {
        light: cfg.text?.subtle?.light ?? DEFAULTS.textSubtle.light,
        dark: cfg.text?.subtle?.dark ?? DEFAULTS.textSubtle.dark,
    }

    // ----- Base background ramps (first 6 indices must align across light/dark)
    const baseLightBg = (base: string, neutral: string) => ([
        neutral,                              // 0 neutral bg
        lighten(ramps.baseLight.up2, base),   // 1
        lighten(ramps.baseLight.up1, base),   // 2
        base,                                 // 3
        darken(ramps.baseLight.down1, base),  // 4
        darken(ramps.baseLight.down2, base),  // 5
    ])
    const baseDarkBg = (base: string, neutral: string) => ([
        neutral,                              // 0 neutral bg (dark)
        lighten(ramps.baseDark.up2, base),    // 1
        lighten(ramps.baseDark.up1, base),    // 2
        base,                                 // 3
        darken(ramps.baseDark.down1, base),   // 4
        darken(ramps.baseDark.down2, base),   // 5
    ])

    // Accent/status ramp (5 slots): [tint2, tint1, base, shade1, shade2]
    const rampLight = (hex: string) => ([
        lighten(ramps.accentLight.up2, hex),
        lighten(ramps.accentLight.up1, hex),
        hex,
        darken(ramps.accentLight.down1, hex),
        darken(ramps.accentLight.down2, hex),
    ])
    const rampDark = (hex: string) => ([
        lighten(ramps.accentDark.up2, hex),
        lighten(ramps.accentDark.up1, hex),
        hex,
        darken(ramps.accentDark.down1, hex),
        darken(ramps.accentDark.down2, hex),
    ])

    // ----- Build palettes, keeping identical index layout between light/dark
    const light: string[] = [...baseLightBg(cfg.base.light, cfg.neutral.light)]
    const dark: string[] = [...baseDarkBg(cfg.base.dark, cfg.neutral.dark)]

    // Record the starting index for each ramp
    const rampStart: Record<string, number> = {}

    // Helper to push paired ramps consistently
    const pushRampPair = (key: string, pair: ColorPair) => {
        const startIndex = light.length
        rampStart[key] = startIndex
        light.push(...rampLight(pair.light))
        dark.push(...rampDark(pair.dark))
    }

    // Accents
    pushRampPair('primary', cfg.accents.primary)
    pushRampPair('secondary', cfg.accents.secondary)
    // Status (optional)
    if (cfg.status?.success) pushRampPair('success', cfg.status.success)
    if (cfg.status?.info) pushRampPair('info', cfg.status.info)
    if (cfg.status?.danger) pushRampPair('danger', cfg.status.danger)

    // Append text slots (must be last two)
    const textStrongIndex = light.length
    light.push(textStrong.light); dark.push(textStrong.dark)
    const textSubtleIndex = light.length
    light.push(textSubtle.light); dark.push(textSubtle.dark)

    // Negative indices mapping
    const TEXT_STRONG = -2 // last-1
    const TEXT_SUBTLE = -1 // last

    // Guard: backgrounds must not use the final two indices
    const MAX_BG_INDEX = light.length - 3

    // Shift helper for tint/shade surfaces (doesn't touch negative text indices)
    const shiftTemplate = (tmpl: Template, delta: number): Template => {
        const out: Template = {}
        for (const [k, v] of Object.entries(tmpl)) {
            if (typeof v === 'number' && v >= 0) {
                out[k] = Math.max(0, Math.min(MAX_BG_INDEX, v + delta))
            } else {
                out[k] = v as number
            }
        }
        return out
    }

    // ----- Core surface templates
    const baseTemplate = {
        background: 3,
        backgroundHover: 4,
        backgroundPress: 5,
        backgroundFocus: 4,
        color: TEXT_STRONG,
        colorHover: TEXT_STRONG,
        colorPress: TEXT_STRONG,
        colorFocus: TEXT_STRONG,
        borderColor: 4,
        borderColorHover: 4,
        borderColorPress: 5,
    } as const

    const subtleTemplate = {
        background: 2,
        backgroundHover: 3,
        backgroundPress: 4,
        backgroundFocus: 3,
        color: TEXT_SUBTLE,
        borderColor: 3,
    } as const

    const neutralTemplate = {
        background: 0,
        backgroundHover: 1,
        backgroundPress: 2,
        backgroundFocus: 1,
        color: TEXT_STRONG,
        borderColor: 2,
    } as const

    // Accent/status templates from a ramp start
    const accentFrom = (start: number): Template => ({
        background: start + 2,       // base
        backgroundHover: start + 3,  // shade1
        backgroundPress: start + 4,  // shade2
        backgroundFocus: start + 3,
        color: TEXT_STRONG,          // always strong text on CTA/status
        borderColor: start + 4,
        borderColorHover: start + 3,
        borderColorPress: start + 4,
    })

    const templates: Record<string, Template> = {
        base: baseTemplate,
        subtle: subtleTemplate,
        neutral: neutralTemplate,
    }

    // Optional tint/shade variants for general surfaces
    const includeTintShade = cfg.includeTintShade ?? true
    if (includeTintShade) {
        templates['tint'] = shiftTemplate(baseTemplate, -1)
        templates['tint2'] = shiftTemplate(baseTemplate, -2)
        templates['shade'] = shiftTemplate(baseTemplate, +1)
        templates['shade2'] = shiftTemplate(baseTemplate, +2)
    }

    // Add accent/status templates dynamically
    for (const key of Object.keys(rampStart)) {
        templates[key] = accentFrom(rampStart[key])
    }

    // ----- Build with theme-builder
    const builder = createThemeBuilder()
        .addPalettes({ light, dark })
        .addTemplates(templates)
        .addThemes({
            light: { template: 'base', palette: 'light' },
            dark: { template: 'base', palette: 'dark' },
        })

    // Core children
    builder.addChildThemes({
        subtle: { template: 'subtle' },
        neutral: { template: 'neutral' },
    })
    // Tint/shade children
    if (includeTintShade) {
        builder.addChildThemes({
            tint: { template: 'tint' },
            tint2: { template: 'tint2' },
            shade: { template: 'shade' },
            shade2: { template: 'shade2' },
        })
    }
    // Accent/status children (direct)
    builder.addChildThemes(
        Object.fromEntries(Object.keys(rampStart).map(k => [k, { template: k }]))
    )

    const themes = builder.build()

    // Handy names (runtime) for <Theme name="...">
    const childKeys = ['subtle', 'neutral', ...(includeTintShade ? ['tint', 'tint2', 'shade', 'shade2'] : []), ...Object.keys(rampStart)]
    const themeNames = [
        'light', 'dark',
        ...childKeys.flatMap(k => [`light_${k}`, `dark_${k}`]),
    ] as const

    return {
        themes,
        themeNames,
        indices: {
            textStrong: textStrongIndex,
            textSubtle: textSubtleIndex,
            ramps: rampStart,
        },
    }
}
