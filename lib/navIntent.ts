// navIntent.ts
import { useNavProgress } from '@/stores/navProgressStore';
import type { HrefObject } from 'expo-router';
import { router } from 'expo-router';
import { startTransition } from 'react';

export function navigateWithOverlay(action: () => void) {
    useNavProgress.getState().start();             // show overlay now
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {                  // let overlay commit this frame
            startTransition(() => {
                setTimeout(() => action(), 1);                                  // do the actual navigation
            });
        })

    });
}

// helpers if you prefer to pass href
export function replaceWithOverlay(href: HrefObject) {
    navigateWithOverlay(() => router.replace(href));
}
export function navigateWithOverlayHref(href: HrefObject) {
    navigateWithOverlay(() => router.navigate(href));
}
export function pushWithOverlay(href: HrefObject) {
    navigateWithOverlay(() => router.push(href));
}
