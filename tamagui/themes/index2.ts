import { darken, getLuminance, lighten, rgba } from 'polished';


const enhanceTheme = (baseColor: string, forceColor?: string) => {

    const isLight = getLuminance(baseColor) > 0.5;
    const darkmod = isLight ? 1 : -1;

    const color = forceColor ?? (isLight ? '#000' : '#fff');

    const background = baseColor;
    const backgroundHover = darken(0.03 * darkmod, baseColor);
    const backgroundPress = darken(0.1 * darkmod, baseColor);
    const backgroundFocus = darken(0.12 * darkmod, baseColor);


    const tone = getLuminance(baseColor) > 0.5 ? 'light' : 'dark';
    const borderBase = tone === 'light' ? darken(0.15, baseColor) : lighten(0.18, baseColor);


    const borderColor = darken(0.15, borderBase);
    const borderColorHover = darken(0.03, borderBase);
    const borderColorPress = darken(0.1, borderBase);
    const borderColorFocus = darken(0.12, borderBase);
    const borderColorElevated = lighten(.1, borderBase);


    return {
        background,
        backgroundHover,
        backgroundPress,
        backgroundFocus,
        color,
        colorSubtle: rgba(color, 0.6),
        borderColor,
        borderColorHover,
        borderColorPress,
        borderColorFocus,
        borderColorElevated
    }
}
// ---- 0) CONFIG: brand bases you want to swap between
const BRANDS = {
    lilac: { light: '#D7C8E7', dark: '#200C40' },
    sage: { light: '#DDE2C3', dark: '#24301A' }, // pick a deep companion for dark
    mint: { light: '#C8E6E5', dark: '#123434' },
} as const;

// ---- 1) Shared neutrals (chrome) and accent seeds (don’t change when brand changes)
const NEUTRALS = {
    light: '#F1F5F9',  // slate-50
    dark: '#0B1320',  // deep slate/blue-black
};
const ACCENTS = {
    cta: { light: ['#0D9488', '#fff'], dark: ['#2DD4BF', '#000'] }, // teal 600 / 400
    secondary: { light: ['#0891B2', '#fff'], dark: ['#22D3EE', '#000'] }, // cyan 600 / 400
    success: { light: ['#16A34A', '#fff'], dark: ['#4ADE80', '#000'] }, // green 600 / 400
    warn: { light: ['#F59E0B', '#000'], dark: ['#FCD34D', '#000'] }, // amber 500 / 300
    danger: { light: ['#E11D48', '#fff'], dark: ['#FB7185', '#000'] }, // rose 600 / 400
    // optional subtle brand accent (purple-ish), computed per-brand later if you want
};

// ---- 2) Variant recipe (how far to push soft/elevated/strong etc)
// Keep these small to avoid “too purple” vibes on surfaces
const VARIANT_RECIPE = {
    normal: 0,
    soft: +0.08,  // lighten for light mode, darken for dark mode (we’ll flip automatically)
    elevated: +0.15,
    enhanced: -0.08,
    strong: -0.18,
    vstrong: -0.28,
} as const;

// ---- 3) Helpers using your existing enhanceTheme(baseColor, forceColor?)
type Mode = 'light' | 'dark';
type Variant =
    | 'normal' | 'soft' | 'elevated' | 'enhanced' | 'strong' | 'vstrong';

// choose lighten/darken direction by mode
const tweak = (hex: string, amt: number, mode: Mode) =>
    mode === 'light'
        ? (amt >= 0 ? lighten(amt, hex) : darken(-amt, hex))
        : (amt >= 0 ? darken(amt, hex) : lighten(-amt, hex));

// Build the 6-swatch surface set for a brand base in a mode
const makeSurfaceSeeds = (base: string, mode: Mode) => {
    const out: Record<Variant, string> = {} as any;
    (Object.keys(VARIANT_RECIPE) as Variant[]).forEach(v => {
        out[v] = tweak(base, VARIANT_RECIPE[v], mode);
    });
    return out;
};

// Build a full “*_primary_*” surface object (using your enhanceTheme)
const buildSurfaceThemes = (brandBase: string, mode: Mode, prefix: string) => {
    const seeds = makeSurfaceSeeds(brandBase, mode);
    const entries = Object.entries(seeds).flatMap(([variant, color]) => {
        const key =
            variant === 'normal'
                ? `${mode}_${prefix}`
                : `${mode}_${prefix}_${variant}`;
        return [[key, enhanceTheme(color)]];
    });
    return Object.fromEntries(entries);
};

// Build neutrals
const buildNeutralThemes = (mode: Mode) => {
    const base = mode === 'light' ? NEUTRALS.light : NEUTRALS.dark;
    const seeds = makeSurfaceSeeds(base, mode);
    const entries = Object.entries(seeds).flatMap(([variant, color]) => {
        const key =
            variant === 'normal'
                ? `${mode}_neutral`
                : `${mode}_neutral_${variant}`;
        return [[key, enhanceTheme(color)]];
    });
    return Object.fromEntries(entries);
};

// Build accents (buttons/status). We also generate the 6-variant family by nudging around the seed.
const buildAccentFamily = (seed: string, mode: Mode) => {
    // center around the seed: soft/elevated a bit brighter, strong/vstrong darker
    const recipe: Record<Variant, number> = {
        normal: 0.00,
        soft: mode === 'light' ? +0.10 : +0.15,
        elevated: mode === 'light' ? -0.08 : -0.04,
        enhanced: mode === 'light' ? -0.10 : -0.06,
        strong: -0.18,
        vstrong: -0.26,
    };
    const out: Record<Variant, string> = {} as any;
    (Object.keys(recipe) as Variant[]).forEach(v => {
        out[v] = tweak(seed, recipe[v], mode);
    });
    return out;
};

const buildAccents = (mode: Mode) => {
    const map: Record<string, [string, string]> = Object.fromEntries(
        Object.entries(ACCENTS).map(([k, v]) => [k, mode === 'light' ? v.light : v.dark])
    ) as any;

    const out: Record<string, ReturnType<typeof enhanceTheme>> = {};

    Object.entries(map).forEach(([name, [seed, forceColor]]) => {
        const fam = buildAccentFamily(seed, mode);
        (Object.entries(fam) as [Variant, string][]).forEach(([variant, color]) => {
            const key =
                variant === 'normal'
                    ? `${mode}_accent_${name}`
                    : `${mode}_accent_${name}_${variant}`;
            out[key] = enhanceTheme(color, forceColor);
        });
    });

    return out;
};

// ---- 4) Factory: give it a brand, get a full theme object
export const createBrandTheme = (brand: keyof typeof BRANDS) => {
    const { light, dark } = BRANDS[brand];

    const lightTheme = {
        ...buildSurfaceThemes(light, 'light', 'primary'),
        ...buildNeutralThemes('light'),
        ...buildAccents('light'),
    };
    const darkTheme = {
        ...buildSurfaceThemes(dark, 'dark', 'primary'),
        ...buildNeutralThemes('dark'),
        ...buildAccents('dark'),
    };

    return { ...lightTheme, ...darkTheme };
};

// ---- 5) Usage: swap bases with one line
export const lilacTheme = createBrandTheme('lilac');
export const sageTheme = createBrandTheme('sage');
export const mintTheme = createBrandTheme('mint');
