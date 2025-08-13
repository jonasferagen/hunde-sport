// tamagui.config.ts
import { createAnimations } from '@tamagui/animations-moti'
import { defaultConfig, tokens } from '@tamagui/config/v4'
import { createInterFont } from '@tamagui/font-inter'
import { shorthands } from '@tamagui/shorthands'
import { createTamagui } from 'tamagui'

export const font = createInterFont({
    // Typography scale (edit to taste)
    size: { 1: 12, 2: 14, 3: 15, 4: 16, 5: 18, 6: 20 },
    lineHeight: { 1: 18, 2: 20, 3: 22, 4: 24, 5: 26, 6: 28 },
    weight: { 1: '300', 2: '400', 3: '400', 4: '500', 5: '600', 6: '600' },
    letterSpacing: { 1: 0, 2: 0, 3: 0, 4: 0, 5: -0.2, 6: -0.2 },

})
const animations = createAnimations({
    bouncy: { damping: 20, mass: 1.2, stiffness: 250 },
    lazy: { damping: 20, stiffness: 60 },
    medium: { damping: 10, mass: 0.9, stiffness: 100 },
    fast: { damping: 25, mass: 0.8, stiffness: 300 },
    linear: { type: 'timing', duration: 300 },
    linearSlow: { type: 'timing', duration: 1000 },
})


import { themes } from './themes/sageTheme'

export const appConfig = createTamagui({
    animations,
    tokens,
    shorthands,
    fonts: { ...defaultConfig.fonts, heading: font, body: font },
    themes: { ...defaultConfig.themes, ...themes } as const,
});

export type AppConfig = typeof appConfig;

export default appConfig;
