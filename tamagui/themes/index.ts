import { themes } from '@tamagui/themes'
import { darken, lighten, readableColor, rgba } from 'polished'

const withThemeExtras = (baseTheme: Record<string, string>, baseColor: string) => {
    return {
        ...baseTheme,

        background: baseColor,
        backgroundSoft: lighten(0.05, baseColor),
        backgroundStrong: darken(0.1, baseColor),
        backgroundElevated: lighten(0.1, baseColor),
        backgroundAlpha: rgba(baseColor, 0.7),

        borderColor: darken(0.1, baseColor),
        borderColorSoft: baseColor,
        borderColorStrong: darken(0.15, baseColor),
        borderColorElevated: lighten(0.05, baseColor),

        color: readableColor(baseColor, '#fff', '#111'),
        colorSubtle: rgba(readableColor(baseColor, '#fff', '#111'), 0.6),

        overlayColor: rgba(baseColor, 0.5),

        backgroundHover: darken(0.03, baseColor),
        backgroundPress: darken(0.1, baseColor),
        backgroundFocus: darken(0.12, baseColor),

        shadowColor: darken(0.4, baseColor),

    }
}


export const sageTheme = withThemeExtras(themes.light, '#DDE2C3')
export const sageThemeSoft = withThemeExtras(themes.light, lighten(0.1, '#DDE2C3'))
export const sageThemeElevated = withThemeExtras(themes.light, lighten(0.2, '#DDE2C3'))
export const sageThemeStrong = withThemeExtras(themes.light, darken(0.1, '#DDE2C3'))
export const sageThemeAlt1 = withThemeExtras(themes.light, '#7F924C')
export const sageThemeAlt2 = withThemeExtras(themes.light, '#6B8E6B', true)


export const lilacTheme = withThemeExtras(themes.light, '#D7C8E7')
export const lilacThemeSoft = withThemeExtras(themes.light, lighten(0.1, '#D7C8E7'))
export const lilacThemeElevated = withThemeExtras(themes.light, lighten(0.2, '#DDE2C3'))
export const lilacThemeStrong = withThemeExtras(themes.light, darken(0.1, '#DDE2C3'))
export const lilacThemeAlt1 = withThemeExtras(themes.light, '#7A4DB1')
export const lilacThemeAlt2 = withThemeExtras(themes.light, '#DDE2C3')


export const mintTheme = withThemeExtras(themes.light, '#C8E6E5')
export const mintThemeSoft = withThemeExtras(themes.light, lighten(0.1, '#C8E6E5'))
export const mintThemeElevated = withThemeExtras(themes.light, lighten(0.2, '#DDE2C3'))
export const mintThemeStrong = withThemeExtras(themes.light, darken(0.1, '#DDE2C3'))
export const mintThemeAlt1 = withThemeExtras(themes.light, '#2FA7A3')
export const mintThemeAlt2 = withThemeExtras(themes.light, '#7B9B9B')


export const augmentedLightTheme = withThemeExtras(themes.light, themes.light.background)
export const augmentedLightThemeSoft = withThemeExtras(themes.light, lighten(0.1, themes.light.background))
export const augmentedLightThemeElevated = withThemeExtras(themes.light, lighten(0.2, themes.light.background))
export const augmentedLightThemeStrong = withThemeExtras(themes.light, darken(0.1, themes.light.background))
export const augmentedLightThemeAlt1 = withThemeExtras(themes.light, darken(0.2, themes.light.background))
export const augmentedLightThemeAlt2 = withThemeExtras(themes.light, darken(0.3, themes.light.background))


export const dangerTheme = withThemeExtras(themes.dark, themes.dark_red.background)
export const dangerThemeAlt1 = withThemeExtras(themes.dark, themes.dark_red_alt2.background)
export const dangerThemeAlt2 = withThemeExtras(themes.dark, themes.dark_red_active.background)
