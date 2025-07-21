import { defaultConfig } from '@tamagui/config/v4'
import { createTamagui } from 'tamagui'

export const config = createTamagui({
    ...defaultConfig,
    settings: { ...defaultConfig.settings, onlyAllowShorthands: false, },
})

type OurConfig = typeof config

declare module 'tamagui' {
    interface TamaguiCustomConfig extends OurConfig { }
}