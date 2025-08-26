// tamagui.config.ts

import { defaultConfig, tokens } from '@tamagui/config/v4';
import { shorthands } from '@tamagui/shorthands';
import { createTamagui } from 'tamagui';
import { animations } from './animations';
import { montserratFont as font } from './fonts';
import { mintTheme } from './themes/mintTheme';

// 1) Names as a typed union
type BuiltThemeName = (typeof mintTheme.themeNames)[number]
type NativeThemeName = keyof typeof defaultConfig.themes
export type AppThemeName = NativeThemeName | BuiltThemeName

// 2) Make the merged themes map keep literal keys (avoid widening to `string`)
type ThemeMap<K extends string> = Record<K, Record<string, any>>
const mergedThemes = {
    ...defaultConfig.themes,
    ...(mintTheme.themes as ThemeMap<BuiltThemeName>),
} as ThemeMap<AppThemeName>


const appConfig = createTamagui({
    animations,
    tokens,
    shorthands,
    fonts: { ...defaultConfig.fonts, heading: font, body: font },
    themes: mergedThemes,
    themeNames: mintTheme.themeNames,
});

export type AppConfig = typeof appConfig;
declare module '@tamagui/core' {
    interface TamaguiCustomConfig extends AppConfig { }
}


export default appConfig;
