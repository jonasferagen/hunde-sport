import { themes } from '@tamagui/themes';
import { darken, lighten, readableColor, rgba } from 'polished';



const enhanceTheme = (baseTheme: Record<string, string>, baseColor: string) => {

    const backgroundColor = baseColor;
    const color = readableColor(baseColor, '#fff', '#000');
    const borderColor = darken(0.1, baseColor);
    const backgroundHover = darken(0.03, baseColor);
    const backgroundPress = darken(0.1, baseColor);
    const backgroundFocus = darken(0.12, baseColor);

    return {
        ...baseTheme,
        background: backgroundColor,
        borderColor: borderColor,
        color: color,
        colorSubtle: rgba(color, 0.6),

        backgroundHover: backgroundHover,
        backgroundPress: backgroundPress,
        backgroundFocus: backgroundFocus,
    }
}



const sageColor = '#DDE2C3'


export const sageTheme = {
    light_primary: enhanceTheme(themes.light, sageColor),
    light_primary_soft: enhanceTheme(themes.light, lighten(0.1, sageColor)),
    light_primary_elevated: enhanceTheme(themes.light, lighten(0.2, sageColor)),
    light_primary_enhanced: enhanceTheme(themes.light, darken(0.1, sageColor)),
    light_primary_strong: enhanceTheme(themes.light, darken(0.2, sageColor)),
    dark_primary: enhanceTheme(themes.dark, sageColor),
    dark_primary_soft: enhanceTheme(themes.dark, lighten(0.1, sageColor)),
    dark_primary_elevated: enhanceTheme(themes.dark, lighten(0.2, sageColor)),
    dark_primary_enhanced: enhanceTheme(themes.dark, darken(0.1, sageColor)),
    dark_primary_strong: enhanceTheme(themes.dark, darken(0.2, sageColor)),
}


const lilacColor = '#D7C8E7'


export const lilacTheme = {
    light_secondary: enhanceTheme(themes.light, lilacColor),
    light_secondary_soft: enhanceTheme(themes.light, lighten(0.1, lilacColor)),
    light_secondary_elevated: enhanceTheme(themes.light, lighten(0.2, lilacColor)),
    light_secondary_enhanced: enhanceTheme(themes.light, darken(0.1, lilacColor)),
    light_secondary_strong: enhanceTheme(themes.light, darken(0.2, lilacColor)),
    dark_secondary: enhanceTheme(themes.dark, lilacColor),
    dark_secondary_soft: enhanceTheme(themes.dark, lighten(0.1, lilacColor)),
    dark_secondary_elevated: enhanceTheme(themes.dark, lighten(0.2, lilacColor)),
    dark_secondary_enhanced: enhanceTheme(themes.dark, darken(0.1, lilacColor)),
    dark_secondary_strong: enhanceTheme(themes.dark, darken(0.2, lilacColor)),
}

const mintColor = '#C8E6E5'

export const mintTheme = {
    light_tertiary: enhanceTheme(themes.light, mintColor),
    light_tertiary_soft: enhanceTheme(themes.light, lighten(0.1, mintColor)),
    light_tertiary_elevated: enhanceTheme(themes.light, lighten(0.2, mintColor)),
    light_tertiary_enhanced: enhanceTheme(themes.light, darken(0.1, mintColor)),
    light_tertiary_strong: enhanceTheme(themes.light, darken(0.2, mintColor)),
    dark_tertiary: enhanceTheme(themes.dark, mintColor),
    dark_tertiary_soft: enhanceTheme(themes.dark, lighten(0.1, mintColor)),
    dark_tertiary_elevated: enhanceTheme(themes.dark, lighten(0.2, mintColor)),
    dark_tertiary_enhanced: enhanceTheme(themes.dark, darken(0.1, mintColor)),
    dark_tertiary_strong: enhanceTheme(themes.dark, darken(0.2, mintColor)),
}


const lightColor = themes.light.background;

export const lightTheme = {
    light: enhanceTheme(themes.light, lightColor),
    light_soft: enhanceTheme(themes.light, lighten(0.1, lightColor)),
    light_elevated: enhanceTheme(themes.light, lighten(0.2, lightColor)),
    light_enhanced: enhanceTheme(themes.light, darken(0.1, lightColor)),
    light_strong: enhanceTheme(themes.light, darken(0.2, lightColor)),
}

const darkColor = themes.dark.background;

export const darkTheme = {
    dark: enhanceTheme(themes.dark, darkColor),
    dark_soft: enhanceTheme(themes.dark, lighten(0.1, darkColor)),
    dark_elevated: enhanceTheme(themes.dark, lighten(0.2, darkColor)),
    dark_enhanced: enhanceTheme(themes.dark, darken(0.1, darkColor)),
    dark_strong: enhanceTheme(themes.dark, darken(0.2, darkColor)),
}


export const dangerTheme = enhanceTheme(themes.dark, themes.dark_red.background)
export const dangerThemeAlt1 = enhanceTheme(themes.dark, themes.dark_red_alt2.background)
export const dangerThemeAlt2 = enhanceTheme(themes.dark, themes.dark_red_active.background)

export const successTheme = enhanceTheme(themes.dark, themes.dark_green.background)
export const successThemeAlt1 = enhanceTheme(themes.dark, '#0F766E')
export const successThemeAlt2 = enhanceTheme(themes.dark, '#065F46')
export const successThemeAlt3 = enhanceTheme(themes.dark, '#1D4ED8')
export const successThemeAlt4 = enhanceTheme(themes.dark, '#1E3A8A')
export const successThemeAlt5 = enhanceTheme(themes.dark, '#0B5394')
export const successThemeAlt6 = enhanceTheme(themes.dark, '#4C1D95')
export const successThemeAlt7 = enhanceTheme(themes.dark, '#9D174D')
export const successThemeAlt8 = enhanceTheme(themes.dark, '#7C2D12')
export const successThemeAlt9 = enhanceTheme(themes.dark, '#92400E')
export const successThemeAlt10 = enhanceTheme(themes.dark, '#0F172A')


export const extraThemes = {
    dark_success: successTheme,
    dark_success_alt1: successThemeAlt1,
    dark_success_alt2: successThemeAlt2,
    dark_success_alt3: successThemeAlt3,
    dark_success_alt4: successThemeAlt4,
    dark_success_alt5: successThemeAlt5,
    dark_success_alt6: successThemeAlt6,
    dark_success_alt7: successThemeAlt7,
    dark_success_alt8: successThemeAlt8,
    dark_success_alt9: successThemeAlt9,
    dark_success_alt10: successThemeAlt10,
    dark_danger: dangerTheme,
    dark_danger_alt1: dangerThemeAlt1,
    dark_danger_alt2: dangerThemeAlt2
}
