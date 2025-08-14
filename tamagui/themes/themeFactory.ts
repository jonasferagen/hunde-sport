// themeFactory.ts (managed combos)
// - Status are root-only (light_success / dark_success ...), no child themes
// - Accents remain children (stackable), plus root aliases for explicit use
// - Adds light_base / dark_base root aliases

// + add this import
import { darken, lighten, readableColor } from 'polished';



import { createThemeBuilder } from '@tamagui/theme-builder';

type ColorPair = { light: string; dark: string }

export type ThemeFactoryConfig = {
    base: ColorPair
    neutral: ColorPair
    alt?: ColorPair
    text?: {
        strong?: ColorPair
        subtle?: ColorPair
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
    // ...
    textOnStrongSurfaces?: 'fixedByTone' | 'autoContrast' // default 'fixedByTone'
    ramps?: {
        baseLight?: Partial<Ramp6>
        baseDark?: Partial<Ramp6>
        accentLight?: Partial<Ramp5>
        accentDark?: Partial<Ramp5>
    }
    includeTintShade?: boolean // default true
    // New: control how we wire child vs root themes to avoid theme explosion
    childControls?: {
        accentsAsChildren?: boolean   // default true (stackable)
        statusAsChildren?: boolean    // default false (root-only)
        addBaseAliases?: boolean      // default true (light_base/dark_base)
        addAccentRootAliases?: boolean// default true (light_primary/dark_primary, ...)
    }
}

// ----- internals

type Ramp6 = { up2: number; up1: number; down1: number; down2: number }
type Ramp5 = { up2: number; up1: number; down1: number; down2: number }
type Template = Record<string, number>

const DEFAULTS = {
    textStrong: { light: '#000000', dark: '#FFFFFF' },
    textSubtle: { light: '#334155', dark: '#E5E7EB' },
    ramps: {
        baseLight: { up2: 0.12, up1: 0.06, down1: 0.06, down2: 0.12 } as Ramp6,
        baseDark: { up2: 0.18, up1: 0.12, down1: 0.06, down2: 0.12 } as Ramp6,
        accentLight: { up2: 0.18, up1: 0.09, down1: 0.08, down2: 0.16 } as Ramp5,
        accentDark: { up2: 0.24, up1: 0.16, down1: 0.08, down2: 0.16 } as Ramp5,
    },
} as const

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n))
const up = (hex: string, amt: number) => lighten(amt, hex)
const down = (hex: string, amt: number) => darken(amt, hex)

const buildBase6 = (base: string, neutral: string, r: Ramp6) => ([
    neutral, up(base, r.up2), up(base, r.up1),
    base, down(base, r.down1), down(base, r.down2),
])

const buildRamp5 = (hex: string, r: Ramp5) => ([
    up(hex, r.up2), up(hex, r.up1), hex, down(hex, r.down1), down(hex, r.down2),
])

const shiftTemplate = (tmpl: Template, delta: number, maxIdx: number): Template => {
    const out: Template = {}
    for (const [k, v] of Object.entries(tmpl)) out[k] = v >= 0 ? clamp(v + delta, 0, maxIdx) : v
    return out
}

// change this so it includes color* states we can override later
const accentTemplateFrom = (start: number): Template => ({
    background: start + 2,
    backgroundHover: start + 3,
    backgroundPress: start + 4,
    backgroundFocus: start + 3,
    color: -1,           // placeholder, will be overridden
    colorHover: -1,
    colorPress: -1,
    colorFocus: -1,
    borderColor: start + 4,
    borderColorHover: start + 3,
    borderColorPress: start + 4,
})


const altTemplateFromBase = (start: number): Template => ({
    background: start + 3,
    backgroundHover: start + 4,
    backgroundPress: start + 5,
    backgroundFocus: start + 4,
    color: -1, // strong
    borderColor: start + 4,
    borderColorHover: start + 4,
    borderColorPress: start + 5,
})

const altSubtleFromBase = (start: number): Template => ({
    background: start + 2,
    backgroundHover: start + 3,
    backgroundPress: start + 4,
    backgroundFocus: start + 3,
    color: -2, // subtle
    borderColor: start + 3,
})

export function createAppThemes(cfg: ThemeFactoryConfig) {
    const controls = {
        accentsAsChildren: cfg.childControls?.accentsAsChildren ?? true,
        statusAsChildren: cfg.childControls?.statusAsChildren ?? false, // <- default OFF
        addBaseAliases: cfg.childControls?.addBaseAliases ?? true,
        addAccentRootAliases: cfg.childControls?.addAccentRootAliases ?? true,
    }


    // + which strategy?
    const textOnStrongSurfaces =
        cfg.textOnStrongSurfaces ?? 'fixedByTone' // default as requested

    // ramps + text colors
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



    // palettes
    const light: string[] = buildBase6(cfg.base.light, cfg.neutral.light, ramps.baseLight)
    const dark: string[] = buildBase6(cfg.base.dark, cfg.neutral.dark, ramps.baseDark)

    const baseStart: Record<string, number> = {}
    const rampStart: Record<string, number> = {}

    // + keep the raw center hex for each ramp so we can compute readable text
    const rampBaseHex: Record<string, ColorPair> = {}
    const pushBasePair6 = (key: string, pair: ColorPair, neutral: ColorPair) => {
        baseStart[key] = light.length
        light.push(...buildBase6(pair.light, neutral.light, ramps.baseLight))
        dark.push(...buildBase6(pair.dark, neutral.dark, ramps.baseDark))
    }
    if (cfg.alt) pushBasePair6('alt', cfg.alt, cfg.neutral)

    const pushRampPair5 = (key: string, pair: ColorPair) => {
        rampStart[key] = light.length
        light.push(...buildRamp5(pair.light, ramps.accentLight))
        dark.push(...buildRamp5(pair.dark, ramps.accentDark))
        // + remember the ramp’s center color (index start+2) for contrast calc
        rampBaseHex[key] = pair
    }

    // accents (unchanged)
    pushRampPair5('primary', cfg.accents.primary)
    pushRampPair5('secondary', cfg.accents.secondary)

    // status (unchanged)
    if (cfg.status?.success) pushRampPair5('success', cfg.status.success)
    if (cfg.status?.info) pushRampPair5('info', cfg.status.info)
    if (cfg.status?.danger) pushRampPair5('danger', cfg.status.danger)

    // append text
    // + create one shared slot OR per-ramp slots, depending on strategy
    let textOnStrongIdx: number | null = null
    const textOnStrongIdxByKey: Record<string, number> = {}

    if (textOnStrongSurfaces === 'fixedByTone') {
        // white on light palette, black on dark palette
        textOnStrongIdx = light.length
        light.push('#FFFFFF')
        dark.push('#000000')
    } else {
        // autoContrast per ramp via polished.readableColor
        for (const key of Object.keys(rampStart)) {
            const pair = rampBaseHex[key] // { light, dark }
            const lightText = readableColor(pair.light, '#000000', '#FFFFFF')
            const darkText = readableColor(pair.dark, '#000000', '#FFFFFF')
            textOnStrongIdxByKey[key] = light.length
            light.push(lightText)
            dark.push(darkText)
        }
    }
    // append text (keep these as *last two* like before)
    const textSubtleIndex = light.length; light.push(textSubtle.light); dark.push(textSubtle.dark)
    const textStrongIndex = light.length; light.push(textStrong.light); dark.push(textStrong.dark)
    const MAX_BG_INDEX = light.length - 3

    // templates
    const baseTemplate: Template = {
        background: 3, backgroundHover: 4, backgroundPress: 5, backgroundFocus: 4,
        color: -1, colorHover: -1, colorPress: -1, colorFocus: -1,
        borderColor: 4, borderColorHover: 4, borderColorPress: 5,
    }
    const subtleTemplate: Template = {
        background: 2, backgroundHover: 3, backgroundPress: 4, backgroundFocus: 3,
        color: -2, borderColor: 3,
    }
    const neutralTemplate: Template = {
        background: 0, backgroundHover: 1, backgroundPress: 2, backgroundFocus: 1,
        color: -1, borderColor: 2,
    }

    const templates: Record<string, Template> = {
        base: baseTemplate,
        subtle: subtleTemplate,
        neutral: neutralTemplate,
    }

    const includeTintShade = cfg.includeTintShade ?? true
    if (includeTintShade) {
        templates['tint'] = shiftTemplate(baseTemplate, -1, MAX_BG_INDEX)
        templates['tint2'] = shiftTemplate(baseTemplate, -2, MAX_BG_INDEX)
        templates['shade'] = shiftTemplate(baseTemplate, +1, MAX_BG_INDEX)
        templates['shade2'] = shiftTemplate(baseTemplate, +2, MAX_BG_INDEX)
    }

    // alt base
    if (baseStart.alt !== undefined) {
        templates['alt'] = altTemplateFromBase(baseStart.alt)
        templates['alt_subtle'] = altSubtleFromBase(baseStart.alt)
        if (includeTintShade) {
            templates['alt_tint'] = shiftTemplate(templates['alt'], -1, MAX_BG_INDEX)
            templates['alt_shade'] = shiftTemplate(templates['alt'], +1, MAX_BG_INDEX)
        }
    }

    // ... build base templates as before ...

    // accent/status surface templates
    for (const key of Object.keys(rampStart)) {
        templates[key] = accentTemplateFrom(rampStart[key])

        // pick the index that holds our high-contrast text for this ramp
        const idx = (textOnStrongSurfaces === 'fixedByTone')
            ? (textOnStrongIdx as number)
            : textOnStrongIdxByKey[key]

        // override all color* states for strong readability
        templates[key].color = idx
        templates[key].colorHover = idx
        templates[key].colorPress = idx
        templates[key].colorFocus = idx
    }

    // ----- build
    const builder = createThemeBuilder()
        .addPalettes({ light, dark })
        .addTemplates(templates)
        .addThemes({
            light: { template: 'base', palette: 'light' },
            dark: { template: 'base', palette: 'dark' },
        })

    // base aliases (requested: light_base / dark_base)
    if (controls.addBaseAliases) {
        builder.addThemes({
            light_base: { template: 'base', palette: 'light' },
            dark_base: { template: 'base', palette: 'dark' },
        })
    }

    // child sets (stackable)
    const addChildSet = (names: string[]) => {
        const entries = Object.fromEntries(names
            .filter((n) => n in templates)
            .map((n) => [n, { template: n }]))
        if (Object.keys(entries).length) builder.addChildThemes(entries)
    }

    // keep these as children (stackable across the tree)
    addChildSet(['subtle', 'neutral'])
    if (includeTintShade) addChildSet(['tint', 'tint2', 'shade', 'shade2'])
    if (baseStart.alt !== undefined) {
        const names = ['alt', 'alt_subtle', ...(includeTintShade ? ['alt_tint', 'alt_shade'] : [])]
        addChildSet(names)
    }

    // accents: default = children (stackable)
    if (controls.accentsAsChildren) addChildSet(['primary', 'secondary'])

    // status: default = NOT children -> add as root-only themes
    const statusKeys = ['success', 'info', 'danger'].filter(k => k in rampStart)
    if (controls.statusAsChildren) {
        addChildSet(statusKeys)
    } else {
        const statusRoots = statusKeys.reduce<Record<string, { template: string; palette: 'light' | 'dark' }>>(
            (acc, k) => {
                acc[`light_${k}`] = { template: k, palette: 'light' }
                acc[`dark_${k}`] = { template: k, palette: 'dark' }
                return acc
            }, {})
        builder.addThemes(statusRoots)
    }

    // optional: root aliases for accents too (handy for explicit usage)
    if (controls.addAccentRootAliases) {
        const accentRoots = (['primary', 'secondary'] as const).reduce<
            Record<string, { template: string; palette: 'light' | 'dark' }>
        >((acc, k) => {
            acc[`light_${k}`] = { template: k, palette: 'light' }
            acc[`dark_${k}`] = { template: k, palette: 'dark' }
            return acc
        }, {})
        builder.addThemes(accentRoots)
    }

    const themes = builder.build()

    // export names you’ll likely use
    const childKeys = [
        'subtle', 'neutral',
        ...(includeTintShade ? ['tint', 'tint2', 'shade', 'shade2'] : []),
        ...(baseStart.alt !== undefined ? ['alt', 'alt_subtle', ...(includeTintShade ? ['alt_tint', 'alt_shade'] : [])] : []),
        ...(controls.accentsAsChildren ? ['primary', 'secondary'] : []),
        ...(controls.statusAsChildren ? statusKeys : []),
    ]

    const rootAliases = [
        ...(controls.addBaseAliases ? ['light_base', 'dark_base'] : []),
        ...(controls.addAccentRootAliases ? ['light_primary', 'dark_primary', 'light_secondary', 'dark_secondary'] : []),
        ...(!controls.statusAsChildren ? statusKeys.flatMap(k => [`light_${k}`, `dark_${k}`]) : []),
    ]

    const themeNames = [
        'light', 'dark',
        ...rootAliases,
        ...childKeys.flatMap(k => [`light_${k}`, `dark_${k}`]),
    ] as const


    return {
        themes,
        themeNames,
        indices: {
            textStrong: textStrongIndex,
            textSubtle: textSubtleIndex,
            ramps: rampStart,
            altStart: baseStart.alt,
            // + helpful when tweaking
            textOnStrongSurfaces:
                textOnStrongSurfaces === 'fixedByTone'
                    ? { shared: textOnStrongIdx! }
                    : { perRamp: textOnStrongIdxByKey },
        },
    }
}
