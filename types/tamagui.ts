import appConfig from '@/tamagui/tamagui.config';

// This is the base type for the Tamagui configuration
export type AppConfig = typeof appConfig;

// This extends the Tamagui module to include our custom configuration.
declare module 'tamagui' {
    // Adds the custom configuration to Tamagui's internal types.
    interface TamaguiCustomConfig extends AppConfig { }


}
