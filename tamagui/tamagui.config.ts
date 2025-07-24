import { createAnimations } from '@tamagui/animations-react-native';
import { themes, tokens } from '@tamagui/config/v3';
import { createInterFont } from '@tamagui/font-inter';
import { shorthands } from '@tamagui/shorthands';
import { createTamagui } from 'tamagui';

const font = createInterFont({
    size: {
        1: 12,
        2: 14,
        3: 15,
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
    bouncy: {
        type: 'spring',
        damping: 10,
        mass: 0.9,
        stiffness: 100,
    },
    lazy: {
        type: 'spring',
        damping: 20,
        stiffness: 60,
    },
    quick: {
        type: 'spring',
        damping: 20,
        mass: 1.2,
        stiffness: 250,
    },
});

//    accent: '#C8E6E5',

const customTokens = {
    ...tokens,
    color: {
        ...tokens.color,
        primary: '#D7C8E7',
        primaryPress: '#C1B2D1',
        primaryText: '#5f4a73',
        primaryBorder: '#a992c5',
        secondary: '#DDE2C3',
        secondaryPress: '#C9D0A9',
        secondaryText: '#444f21',
        secondaryBorder: '#b1bb87',
        accent: '#C8E6E5',
        accentPress: '#B2D0CF',
        accentText: '#4d7372',
        accentBorder: '#92c3c1',
        default: '#FFFFFF',
        defaultText: '#000000',
        defaultBorder: '#E8E8E8',
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
        light: {
            ...themes.light,
            background: customTokens.color.default,
            backgroundPress: themes.light.gray3,
            color: customTokens.color.defaultText,
            primary: customTokens.color.primary,
            primaryPress: customTokens.color.primaryPress,
            secondary: customTokens.color.secondary,
            secondaryPress: customTokens.color.secondaryPress,
            accent: customTokens.color.accent,
            accentPress: customTokens.color.accentPress,
        },
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
