import { createAnimations } from '@tamagui/animations-moti';
import { themes, tokens } from '@tamagui/config/v3';
import { createInterFont } from '@tamagui/font-inter';
import { shorthands } from '@tamagui/shorthands';
import { createTamagui } from 'tamagui';
import {
    augmentedLightTheme,
    augmentedLightThemeAlt1,
    augmentedLightThemeAlt2,
    augmentedLightThemeSoft,
    lilacTheme,
    lilacThemeAlt1,
    lilacThemeAlt2,
    lilacThemeAlt3,
    lilacThemeSoft,
    mintTheme,
    mintThemeAlt1,
    mintThemeAlt2,
    mintThemeAlt3,
    mintThemeSoft,
    sageTheme,
    sageThemeAlt1,
    sageThemeAlt2,
    sageThemeAlt3,
    sageThemeElevated,
    sageThemeSoft
} from './themes';


const font = createInterFont({
    size: {
        1: 12,
        2: 14,
        3: 15,
        4: 16,
        5: 18,
        6: 20,
    },
    lineHeight: {
        1: 17,
        2: 22,
        3: 25,
    },
    weight: {
        4: '300',
        6: '600',
    },
    letterSpacing: {
        4: 0,
        8: -1,
    },
});

const animations = createAnimations({
    fast: {
        damping: 20,
        mass: 1.2,
        stiffness: 250,
    },
    medium: {
        damping: 10,
        mass: 0.9,
        stiffness: 100,
    },
    slow: {
        damping: 20,
        stiffness: 60,
    }
});

const customTokens = {
    ...tokens,
    color: {
        ...tokens.color,
    },
    fontSize: font.size,
    lineHeight: font.lineHeight,
    radius: {
        0: 0,
        1: 2,
        2: 4,
        3: 8,
        4: 12,
        5: 20,
        6: 9999,
    },
    space: {
        ...tokens.space,
        0: 0,
        1: 4,
        2: 8,
        3: 16,
        4: 24,
        5: 32,
        6: 48,
    },
    size: {
        ...tokens.size,
        0: 0,
        1: 4,
        2: 8,
        3: 16,
        4: 24,
        5: 32,
        6: 48,
    },
    zIndex: { ...tokens.zIndex, 0: 0, 1: 100, 2: 200 },
};



const appConfig = createTamagui({
    animations,
    themes: {
        ...themes,
        primary: lilacTheme,
        primary_soft: lilacThemeSoft,
        primary_alt1: lilacThemeAlt1,
        primary_alt2: lilacThemeAlt2,
        primary_alt3: lilacThemeAlt3,
        secondary: sageTheme,
        secondary_soft: sageThemeSoft,
        secondary_elevated: sageThemeElevated,
        secondary_alt1: sageThemeAlt1,
        secondary_alt2: sageThemeAlt2,
        secondary_alt3: sageThemeAlt3,
        tertiary: mintTheme,
        tertiary_soft: mintThemeSoft,
        tertiary_alt1: mintThemeAlt1,
        tertiary_alt2: mintThemeAlt2,
        tertiary_alt3: mintThemeAlt3,
        light: augmentedLightTheme,
        light_soft: augmentedLightThemeSoft,
        light_alt1: augmentedLightThemeAlt1,
        light_alt2: augmentedLightThemeAlt2,
    },
    tokens: customTokens,
    shorthands,
    fonts: {
        heading: font,
        body: font,
    },
    size: font.size,
    lineHeight: font.lineHeight,
});

export default appConfig;
