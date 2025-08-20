import Constants from 'expo-constants';
import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { checkForUpdate, UpdateFlow } from 'react-native-in-app-updates';

// The installed 'react-native-in-app-updates' exposes a functional API
// via checkForUpdate(UpdateFlow), not a class-based one.

type Options = {
    checkOnStart?: boolean;     // default: true
    checkOnForeground?: boolean;// default: true
    immediate?: boolean;        // default: false (use FLEXIBLE)
    cooldownMs?: number;        // default: 60_000
};

export function usePlayStoreUpdates({
    checkOnStart = true,
    checkOnForeground = true,
    immediate = false,
    cooldownMs = 60_000,
}: Options = {}) {
    const lastCheck = useRef(0);

    useEffect(() => {
        // Skip on non-Android or on your sideload variant
        const pkg = Constants?.expoConfig?.android?.package;
        if (!pkg || pkg.endsWith('.dev')) return;

        const doCheck = async () => {
            const now = Date.now();
            if (now - lastCheck.current < cooldownMs) return;
            lastCheck.current = now;

            try {
                await checkForUpdate(immediate ? UpdateFlow.IMMEDIATE : UpdateFlow.FLEXIBLE);
                // For FLEXIBLE, library handles prompt & completes in background.
                // For IMMEDIATE, user must finish update flow before continuing.
            } catch {
                // ignore — don’t spam users if Play API not ready yet
            }
        };

        if (checkOnStart) doCheck();

        let sub: { remove(): void } | undefined;
        if (checkOnForeground) {
            sub = AppState.addEventListener('change', (s) => s === 'active' && doCheck());
        }
        return () => sub?.remove();
    }, [checkOnStart, checkOnForeground, immediate, cooldownMs]);
}
