import { createAnimations } from '@tamagui/animations-moti';
import { themes, tokens } from '@tamagui/config/v3';
import { createInterFont } from '@tamagui/font-inter';
import { shorthands } from '@tamagui/shorthands';
import { createTamagui } from 'tamagui';
import { augmentedLightTheme, lilacTheme, lilacThemeSoft, mintTheme, mintThemeSoft, sageTheme, sageThemeSoft } from './themes';


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
        secondary: sageTheme,
        secondary_soft: sageThemeSoft,
        tertiary: mintTheme,
        tertiary_soft: mintThemeSoft,
        light: augmentedLightTheme,

    },
    tokens: customTokens,
    shorthands,
    fonts: {
        heading: font,
        body: font,
    },
    size: font.size,
});

export default appConfig;
