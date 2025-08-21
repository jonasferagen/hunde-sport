import Constants from 'expo-constants';
import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { checkForUpdate, UpdateFlow } from 'react-native-in-app-updates';

type Options = {
    checkOnStart?: boolean;
    checkOnForeground?: boolean;
    immediate?: boolean;   // IMMEDIATE for verifying quickly
    cooldownMs?: number;
    startDelayMs?: number; // avoid racing Play right on cold start
    onChecked?: (didPrompt: boolean) => void; // optional debug
};

export function usePlayStoreUpdates({
    checkOnStart = true,
    checkOnForeground = true,
    immediate = false,
    cooldownMs = 60_000,
    startDelayMs = 1500,
    onChecked,
}: Options = {}) {
    const lastCheck = useRef(0);

    useEffect(() => {
        const pkg = Constants?.expoConfig?.android?.package;
        if (!pkg || pkg.endsWith('.dev')) return;           // skip sideload variant

        let mounted = true;

        const doCheck = async () => {
            const now = Date.now();
            if (!mounted || now - lastCheck.current < cooldownMs) return;
            lastCheck.current = now;

            try {
                await checkForUpdate(immediate ? UpdateFlow.IMMEDIATE : UpdateFlow.FLEXIBLE);
                onChecked?.(true);  // update flow started (dialog/snackbar shown)
            } catch {
                onChecked?.(false); // no update or API not ready
            }
        };

        if (checkOnStart) {
            // small delay helps avoid “no update” if Play isn’t ready yet
            const t = setTimeout(doCheck, startDelayMs);
            return () => { mounted = false; clearTimeout(t); };
        }

        return () => { mounted = false; };
    }, [checkOnStart, cooldownMs, immediate, startDelayMs, onChecked]);

    useEffect(() => {
        if (!checkOnForeground) return;
        const sub = AppState.addEventListener('change', s => s === 'active' && checkAgain());
        function checkAgain() {
            // reuse same effect by updating lastCheck gate:
            lastCheck.current = Math.max(0, Date.now() - cooldownMs - 1);
        }
        return () => sub.remove();
    }, [checkOnForeground, cooldownMs]);
}
