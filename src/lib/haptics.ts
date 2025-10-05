// lib/haptics.ts
import * as Haptics from 'expo-haptics';

export const haptic = {
    selection: () => Haptics.selectionAsync().catch(() => { }),
    light: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => { }),
    medium: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => { }),
    success: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => { }),
    error: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => { }),
};
