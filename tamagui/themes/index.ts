import { themes } from '@tamagui/themes'
import { darken, lighten, readableColor, rgba } from 'polished'

const withThemeExtras = (baseTheme: Record<string, string>, baseColor: string, accentColor: string) => {
    return {
        ...baseTheme,

        background: baseColor,
        backgroundLight: lighten(0.05, baseColor),
        backgroundStrong: darken(0.1, baseColor),
        backgroundElevated: lighten(0.1, baseColor),
        backgroundAlpha: rgba(baseColor, 0.7),

        borderColor: darken(0.1, baseColor),
        borderColorStrong: darken(0.2, baseColor),
        borderColorLight: lighten(0.05, baseColor),

        color: readableColor(baseColor, '#111', '#fff', true),
        colorSubtle: rgba(readableColor(baseColor, '#111', '#fff'), 0.6),

        overlayColor: rgba(baseColor, 0.5),

        colorAccent: accentColor,
        colorAccentStrong: darken(0.3, accentColor),
        colorAccentHover: darken(0.1, accentColor),
        colorAccentPress: darken(0.2, accentColor),
        colorAccentElevated: lighten(0.2, accentColor),

        backgroundHover: darken(0.03, baseColor),
        backgroundPress: darken(0.07, baseColor),
        backgroundFocus: darken(0.12, baseColor),

        shadowColor: rgba('#000', 0.1),
        shadowColorStrong: rgba('#000', 0.25),
        shadowColorFocus: rgba('#000', 0.35),
    }
}


export const sageTheme = withThemeExtras(themes.light, '#DDE2C3', '#7F924C')
export const sageThemeSoft = withThemeExtras(themes.light, lighten(0.1, '#DDE2C3'), '#6B8E6B')
export const sageThemeElevated = withThemeExtras(themes.light, lighten(0.2, '#DDE2C3'), '#6B8E6B')
export const sageThemeAlt1 = withThemeExtras(themes.light, darken(0.1, '#DDE2C3'), '#8B7355')
export const sageThemeAlt2 = withThemeExtras(themes.light, darken(0.2, '#DDE2C3'), '#A67B5B')
export const sageThemeAlt3 = withThemeExtras(themes.light, darken(0.3, '#DDE2C3'), '#6B8E6B')


export const lilacTheme = withThemeExtras(themes.light, '#D7C8E7', '#7A4DB1')
export const lilacThemeSoft = withThemeExtras(themes.light, lighten(0.05, '#D7C8E7'), '#7A4DB1')
export const lilacThemeAlt1 = withThemeExtras(themes.light, lighten(0.1, '#DDE2C3'), '#9B7B9B')
export const lilacThemeAlt2 = withThemeExtras(themes.light, lighten(0.1, '#DDE2C3'), '#8B9B8B')
export const lilacThemeAlt3 = withThemeExtras(themes.light, lighten(0.1, '#DDE2C3'), '#B8956B')


export const mintTheme = withThemeExtras(themes.light, '#C8E6E5', '#2FA7A3')
export const mintThemeSoft = withThemeExtras(themes.light, lighten(0.05, '#C8E6E5'), '#2FA7A3')
export const mintThemeAlt1 = withThemeExtras(themes.light, lighten(0.1, '#DDE2C3'), '#7B9B9B')
export const mintThemeAlt2 = withThemeExtras(themes.light, lighten(0.1, '#DDE2C3'), '#A89B7B')
export const mintThemeAlt3 = withThemeExtras(themes.light, lighten(0.1, '#DDE2C3'), '#6B9BAB')


export const augmentedLightTheme = withThemeExtras(themes.light, darken(0.05, themes.light.background), '#6B7B8B')
export const augmentedLightThemeSoft = withThemeExtras(themes.light, themes.light.background, '#6B7B8B')
export const augmentedLightThemeAlt1 = withThemeExtras(themes.light, lighten(0.1, '#DDE2C3'), '#8B7B9B')
export const augmentedLightThemeAlt2 = withThemeExtras(themes.light, lighten(0.1, '#DDE2C3'), '#7B8B6B')


