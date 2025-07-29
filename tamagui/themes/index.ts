import { themes } from '@tamagui/themes'
import { darken, lighten, readableColor, rgba } from 'polished'

const withThemeExtras = (baseTheme: Record<string, string>, baseColor: string, accentColor: string) => {
    return {
        ...baseTheme,

        background: baseColor,
        backgroundLight: lighten(0.05, baseColor),
        backgroundStrong: darken(0.05, baseColor),
        backgroundElevated: darken(0.1, baseColor),

        borderColor: darken(0.1, baseColor),
        borderColorStrong: darken(0.2, baseColor),
        borderColorLight: lighten(0.05, baseColor),

        color: readableColor(baseColor, '#111', '#fff', true),
        colorSubtle: rgba(readableColor(baseColor, '#111', '#fff'), 0.6),

        overlayColor: rgba(baseColor, 0.5),

        colorAccent: accentColor,
        colorAccentHover: darken(0.1, accentColor),
        colorAccentPress: darken(0.2, accentColor),


        backgroundHover: darken(0.03, baseColor),
        backgroundPress: darken(0.07, baseColor),
        backgroundFocus: darken(0.12, baseColor),

        shadowColor: rgba('#000', 0.1),
        shadowColorStrong: rgba('#000', 0.25),
        shadowColorFocus: rgba('#000', 0.35),
    }
}


export const sageTheme = withThemeExtras(themes.light, '#DDE2C3', '#7F924C')
export const sageThemeSoft = withThemeExtras(themes.light, lighten(0.1, '#DDE2C3'), '#7F924C')
export const lilacTheme = withThemeExtras(themes.light, '#D7C8E7', '#7A4DB1')
export const lilacThemeSoft = withThemeExtras(themes.light, lighten(0.05, '#D7C8E7'), '#7A4DB1')
export const mintTheme = withThemeExtras(themes.light, '#C8E6E5', '#2FA7A3')
export const mintThemeSoft = withThemeExtras(themes.light, lighten(0.05, '#C8E6E5'), '#2FA7A3')
export const augmentedLightTheme = withThemeExtras(themes.light, themes.light.background, '#3366FF')