import { darken, lighten } from 'polished';
import { buildThemes } from './themeFactory';

// theme-config.ts

const sl = '#DDE2C3';
const sd = darken(0.5, sl);

export const config = {


    primary: { light: '#C8E6E5', dark: darken(0.6, '#C8E6E5') },
    secondary: { light: sl, dark: sd },
    tertiary: { light: '#bcd1a1', dark: darken(0.6, '#bcd1a1') },
    neutral: { light: '#F1F5F9', dark: darken(0.6, '#F1F5F9') },

    secondary_tint: { light: lighten(0.1, sl), dark: darken(0.1, sd) },
    secondary_shade: { light: darken(0.1, sl), dark: lighten(0.1, sd) },

    // existing accents
    accent1: { light: '#4338CA', dark: '#608f39' },
    accent2: { light: '#334524', dark: '#334524' },
    accent3: { light: '#608f39', dark: '#608f39' },

    // NEW accents (4–13)
    accent4: { light: '#2563EB', dark: '#60A5FA' }, // vivid blue
    accent5: { light: '#4338CA', dark: '#8B8CF8' }, // indigo
    accent6: { light: '#06B6D4', dark: '#67E8F9' }, // sky cyan
    accent7: { light: '#0F766E', dark: '#2DD4BF' }, // deep teal
    accent8: { light: '#059669', dark: '#34D399' }, // emerald
    accent9: { light: '#D946EF', dark: '#F0ABFC' }, // fuchsia
    accent10: { light: '#A855F7', dark: '#D8B4FE' }, // violet
    accent11: { light: '#F97316', dark: '#FDBA74' }, // orange
    accent12: { light: '#EA580C', dark: '#FB923C' }, // burnt orange
    accent13: { light: '#E11D48', dark: '#FB7185' }, // crimson
} as const;

export const mintTheme = buildThemes(config)


// Optional: handy type for <Theme name="...">
export type AppThemeName =
    | `light_${keyof typeof config & string}`
    | `dark_${keyof typeof config & string}`