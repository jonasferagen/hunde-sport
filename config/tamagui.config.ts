import { config as baseConfig } from '@tamagui/config';
import { createTamagui } from 'tamagui';

const config = createTamagui({
    ...baseConfig,
    settings: { ...baseConfig.settings, onlyAllowShorthands: false, },
});

type OurConfig = typeof config

declare module 'tamagui' {
    interface TamaguiCustomConfig extends OurConfig { }
}

export { config };

