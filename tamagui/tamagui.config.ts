// tamagui.config.ts
import { createAnimations } from '@tamagui/animations-moti'
import { tokens } from '@tamagui/config/v4'
import { createInterFont } from '@tamagui/font-inter'
import { shorthands } from '@tamagui/shorthands'
import { createTamagui } from 'tamagui'


const font = createInterFont({
    size: { 1: 12, 2: 14, 3: 15, 4: 16, 5: 18, 6: 20 },
    lineHeight: { 1: 17, 2: 22, 3: 25 },
    weight: { 4: '300', 6: '600' },
    letterSpacing: { 4: 0, 8: -1 },
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

console.log(JSON.stringify(Object.keys(themes), null, 2))

export const appConfig = createTamagui({
    animations,
    tokens,
    shorthands,
    fonts: { heading: font, body: font },
    themes: { ...themes } as const,
});

export type AppConfig = typeof appConfig;

export default appConfig;
