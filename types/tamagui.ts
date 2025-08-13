
import { type AppConfig } from '@/tamagui/tamagui.config';

// This extends the Tamagui module to include our custom configuration.
declare module 'tamagui' {
    // Adds the custom configuration to Tamagui's internal types.
    interface TamaguiCustomConfig extends AppConfig { }
}
