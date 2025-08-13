import { themes } from '@tamagui/themes';
import { complement, darken, getLuminance, invert, lighten, rgba } from 'polished';


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

export const dangerTheme = enhanceTheme(themes.dark_red.background)
export const dangerThemeAlt1 = enhanceTheme(themes.dark_red_alt2.background)
export const dangerThemeAlt2 = enhanceTheme(themes.dark_red_active.background)

export const successTheme = enhanceTheme(themes.dark_green.background)
export const successThemeAlt1 = enhanceTheme('#0F766E')
export const successThemeAlt2 = enhanceTheme('#065F46')
export const successThemeAlt3 = enhanceTheme('#1D4ED8')
export const successThemeAlt4 = enhanceTheme('#1E3A8A')
export const successThemeAlt5 = enhanceTheme('#0B5394')
export const successThemeAlt6 = enhanceTheme('#4C1D95')
export const successThemeAlt7 = enhanceTheme('#9D174D')
export const successThemeAlt8 = enhanceTheme('#7C2D12')
export const successThemeAlt9 = enhanceTheme('#92400E')
export const successThemeAlt10 = enhanceTheme('#0F172A')



const lilacColor = '#D7C8E7'
const lilacColorDark = '#200c40'

export const lilacThemeOld = {
    light_primary: enhanceTheme(lilacColor),
    light_primary_normal: enhanceTheme(lilacColor),
    light_primary_soft: enhanceTheme(lighten(0.1, lilacColor)),
    light_primary_elevated: enhanceTheme(lighten(0.15, lilacColor)),
    light_primary_enhanced: enhanceTheme(darken(0.1, lilacColor)),
    light_primary_strong: enhanceTheme(darken(0.2, lilacColor)),
    light_primary_vstrong: enhanceTheme(darken(0.3, lilacColor)),


    light_primary_accent1: enhanceTheme('#4C1D95'),
    light_primary_accent2: enhanceTheme('#9D174D'),


    dark_primary: enhanceTheme(lilacColorDark),
    dark_primary_normal: enhanceTheme(lilacColorDark),
    dark_primary_soft: enhanceTheme(lighten(0.1, lilacColorDark)),
    dark_primary_elevated: enhanceTheme(lighten(0.15, lilacColorDark)),
    dark_primary_enhanced: enhanceTheme(darken(0.1, lilacColorDark)),
    dark_primary_strong: enhanceTheme(darken(0.2, lilacColorDark)),
    dark_primary_vstrong: enhanceTheme(darken(0.3, lilacColor)),
}

export const lilacTheme = {
    // -----------------
    // Light surfaces (lilac brand)
    light_primary: enhanceTheme('#D7C8E7'), // base lilac
    light_primary_normal: enhanceTheme('#D7C8E7'),
    light_primary_soft: enhanceTheme('#E6DAF2'),
    light_primary_elevated: enhanceTheme('#C5B1DD'),
    light_primary_enhanced: enhanceTheme('#B099D3'),
    light_primary_strong: enhanceTheme('#7E6AB5'),
    light_primary_vstrong: enhanceTheme('#5F4E98'),

    // Light neutrals (general UI chrome, background)
    light_neutral: enhanceTheme('#F1F5F9'),
    light_neutral_soft: enhanceTheme('#E2E8F0'),
    light_neutral_strong: enhanceTheme('#64748B'),

    // Light accents (buttons & statuses)
    light_accent_cta: enhanceTheme('#0D9488', '#fff'), // teal 600
    light_accent_secondary: enhanceTheme('#0891B2', '#fff'), // cyan 600
    light_accent_warn: enhanceTheme('#F59E0B', '#000'), // amber 500
    light_accent_danger: enhanceTheme('#E11D48', '#fff'), // rose 600
    light_accent_success: enhanceTheme('#16A34A', '#fff'), // green 600
    light_accent_purple: enhanceTheme('#5F4E98', '#fff'), // deep lilac

    // -----------------
    // Dark surfaces (deep lilac brand)
    dark_primary: enhanceTheme('#200C40'), // base dark lilac
    dark_primary_normal: enhanceTheme('#200C40'),
    dark_primary_soft: enhanceTheme('#3F3373'),
    dark_primary_elevated: enhanceTheme('#5F4E98'),
    dark_primary_enhanced: enhanceTheme('#7E6AB5'),
    dark_primary_strong: enhanceTheme('#9A83C9'),
    dark_primary_vstrong: enhanceTheme('#B099D3'),

    // Dark neutrals (general UI chrome, background)
    dark_neutral: enhanceTheme('#0B1320'),
    dark_neutral_soft: enhanceTheme('#1E293B'),
    dark_neutral_strong: enhanceTheme('#94A3B8'),

    // Dark accents (buttons & statuses)
    dark_accent_cta: enhanceTheme('#2DD4BF', '#000'), // teal 400
    dark_accent_secondary: enhanceTheme('#22D3EE', '#000'), // cyan 400
    dark_accent_warn: enhanceTheme('#FCD34D', '#000'), // amber 300
    dark_accent_danger: enhanceTheme('#FB7185', '#000'), // rose 400
    dark_accent_success: enhanceTheme('#4ADE80', '#000'), // green 400
    dark_accent_purple: enhanceTheme('#B099D3', '#000'), // soft lilac
};


const sageColor = '#DDE2C3'

export const sageTheme = {
    light_secondary: enhanceTheme(sageColor),
    light_secondary_normal: enhanceTheme(sageColor),
    light_secondary_soft: enhanceTheme(lighten(0.1, sageColor)),
    light_secondary_elevated: enhanceTheme(lighten(0.15, sageColor)),
    light_secondary_enhanced: enhanceTheme(darken(0.1, sageColor)),
    light_secondary_strong: enhanceTheme(darken(0.2, sageColor)),
    light_secondary_vstrong: enhanceTheme(darken(0.3, sageColor)),


    light_primary_alt1: enhanceTheme('#4C1D95'),
    light_primary_alt2: enhanceTheme(complement('#DDE2C3')),
    light_primary_alt3: enhanceTheme(invert('#DDE2C3')),

    dark_secondary: enhanceTheme(sageColor),
    dark_secondary_normal: enhanceTheme(sageColor),
    dark_secondary_soft: enhanceTheme(lighten(0.1, sageColor)),
    dark_secondary_elevated: enhanceTheme(lighten(0.15, sageColor)),
    dark_secondary_enhanced: enhanceTheme(darken(0.1, sageColor)),
    dark_secondary_strong: enhanceTheme(darken(0.2, sageColor)),
    dark_secondary_vstrong: enhanceTheme(darken(0.3, sageColor)),
}




const mintColor = '#C8E6E5'

export const mintTheme = {
    light_tertiary: enhanceTheme(mintColor),
    light_tertiary_normal: enhanceTheme(mintColor),
    light_tertiary_soft: enhanceTheme(lighten(0.1, mintColor)),
    light_tertiary_elevated: enhanceTheme(lighten(0.15, mintColor)),
    light_tertiary_enhanced: enhanceTheme(darken(0.1, mintColor)),
    light_tertiary_strong: enhanceTheme(darken(0.2, mintColor)),
    light_tertiary_vstrong: enhanceTheme(darken(0.3, mintColor)),
    dark_tertiary: enhanceTheme(mintColor),
    dark_tertiary_normal: enhanceTheme(mintColor),
    dark_tertiary_soft: enhanceTheme(lighten(0.1, mintColor)),
    dark_tertiary_elevated: enhanceTheme(lighten(0.15, mintColor)),
    dark_tertiary_enhanced: enhanceTheme(darken(0.1, mintColor)),
    dark_tertiary_strong: enhanceTheme(darken(0.2, mintColor)),
    dark_tertiary_vstrong: enhanceTheme(darken(0.3, mintColor)),
}


const lightColor = themes.light.background;

export const lightTheme = {
    light: enhanceTheme(lightColor),
    light_normal: enhanceTheme(lightColor),
    light_soft: enhanceTheme(lighten(0.1, lightColor)),
    light_elevated: enhanceTheme(lighten(0.2, lightColor)),
    light_enhanced: enhanceTheme(darken(0.1, lightColor)),
    light_strong: enhanceTheme(darken(0.2, lightColor)),
    light_vstrong: enhanceTheme(darken(0.3, lightColor)),
}

const darkColor = themes.dark.background;

export const darkTheme = {
    dark: enhanceTheme(darkColor),
    dark_normal: enhanceTheme(darkColor),
    dark_soft: enhanceTheme(lighten(0.1, darkColor)),
    dark_elevated: enhanceTheme(lighten(0.2, darkColor)),
    dark_enhanced: enhanceTheme(darken(0.1, darkColor)),
    dark_strong: enhanceTheme(darken(0.2, darkColor)),
    dark_vstrong: enhanceTheme(darken(0.3, darkColor)),
}




export const extraThemes = {
    success: successTheme,
    success_alt1: successThemeAlt1,
    success_alt2: successThemeAlt2,
    success_alt3: successThemeAlt3,
    success_alt4: successThemeAlt4,
    success_alt5: successThemeAlt5,
    success_alt6: successThemeAlt6,
    success_alt7: successThemeAlt7,
    success_alt8: successThemeAlt8,
    success_alt9: successThemeAlt9,
    success_alt10: successThemeAlt10,
    danger: dangerTheme,
    danger_alt1: dangerThemeAlt1,
    danger_alt2: dangerThemeAlt2
}

