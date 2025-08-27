import { darken } from 'polished';

import { buildThemes } from './themeFactory';

// theme-config.ts


export const config = {

    primary: { light: '#C8E6E5', dark: '#275554' },
    secondary: { light: '#DDE2C3', dark: '#474e25' },
    tertiary: { light: '#94aa5f', dark: darken(.5, '#94aa5f') },
    accent1: { light: '#EA580C', dark: '#FB923C' }, // burnt orange
    accent2: { light: '#E11D48', dark: '#FB7185' }, // crimson
    accent3: { light: '#9d1432', dark: '#608f39' },
    accent4: { light: '#2563EB', dark: '#60A5FA' }, // vivid blue
    accent5: { light: '#4338CA', dark: '#8B8CF8' }, // indigo
    accent6: { light: '#06B6D4', dark: '#67E8F9' }, // sky cyan
    accent7: { light: '#0F766E', dark: '#2DD4BF' }, // deep teal
    accent8: { light: '#059669', dark: '#34D399' }, // emerald
    accent9: { light: '#D946EF', dark: '#F0ABFC' }, // fuchsia
    accent10: { light: '#A855F7', dark: '#D8B4FE' }, // violet
    accent11: { light: '#F97316', dark: '#FDBA74' }, // orange

} as const;



export const mintTheme = buildThemes(config)


// Optional: handy type for <Theme name="...">
export type AppThemeName =
    | `light_${keyof typeof config & string}`
    | `dark_${keyof typeof config & string}`