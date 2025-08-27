// useCanonicalNav.ts
import { useBackHandler } from '@react-native-community/hooks';
import { useNavigation } from '@react-navigation/native';
import { HrefObject, router, useLocalSearchParams, usePathname } from 'expo-router';
import * as React from 'react';
import { startTransition } from 'react';

import { cleanHref, type NavPolicy,routes } from '@/config/routes';
import { useDrawerStore } from '@/stores/ui/drawerStore';
import { useModalStore } from '@/stores/ui/modalStore';
import { useNavigationProgress } from '@/stores/ui/navigationProgressStore';


type Routes = typeof routes;
type RouteKey = keyof Routes;
type ArgsOf<K extends RouteKey> =
    Routes[K] extends { path: (...a: infer A) => any } ? A : never;

const pathFor = <K extends RouteKey>(k: K) =>
    routes[k].path as (...a: ArgsOf<K>) => HrefObject;

const stripTrailingSlash = (p?: string) => (p?.replace(/\/+$/, '') || '/');

const normalizeParams = (obj?: Record<string, unknown>) => {
    const entries = Object.entries(obj ?? {}).flatMap(([k, v]) => {
        if (v == null) return [];
        if (Array.isArray(v)) v = v[0];
        const s = String(v).trim();
        return s ? ([[k, s]] as const) : [];
    });
    entries.sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
    return Object.fromEntries(entries);
};

const paramsKey = (obj?: Record<string, unknown>) =>
    JSON.stringify(normalizeParams(obj));

const scheduleNav = (fn: () => void, withoutOverlay: boolean) => {
    if (withoutOverlay) { startTransition(fn); return; }
    useNavigationProgress.getState().start(); // flip overlay now (no re-render)
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            setTimeout(() => { startTransition(fn); }, 1); // give overlay a paint
        });
    });
};
// useCanonicalNav.ts
export function useCanonicalNavigation() {
    const rawPathname = usePathname();
    const pathname = React.useMemo(() => stripTrailingSlash(rawPathname), [rawPathname]);

    const paramsObj = useLocalSearchParams();
    const currentParamsKey = React.useMemo(() => paramsKey(paramsObj as any), [paramsObj]);

    // simple in-flight guard
    const navLock = React.useRef<Promise<void> | null>(null);

    const coreTo = React.useCallback(async <K extends RouteKey>(
        key: K,
        withoutOverlay: boolean,
        ...args: ArgsOf<K>
    ): Promise<void> => {
        // prevent overlapping navigations
        if (navLock.current) return;
        navLock.current = (async () => {
            await ensureTransientUiClosed(); // close modal first, then drawer

            const { nav } = routes[key];
            const href = cleanHref(pathFor(key)(...args));
            const targetPath = stripTrailingSlash(href.pathname);
            const policy: NavPolicy = nav;

            scheduleNav(() => {
                if (targetPath === pathname) {
                    if (policy === 'push') router.push(href);
                    else {
                        const nextKey = paramsKey(href.params as any);
                        if (nextKey && nextKey !== currentParamsKey) {
                            router.setParams(href.params as any);
                        }
                    }
                    return;
                }
                if (policy === 'push') router.push(href);
                else if (policy === 'switch') router.navigate(href);
                else router.replace(href);
            }, withoutOverlay);
        })();

        try { await navLock.current; } finally { navLock.current = null; }
    }, [pathname, currentParamsKey]);

    const to = React.useCallback(<K extends RouteKey>(key: K, ...args: ArgsOf<K>) => {
        void coreTo(key, false, ...args);
    }, [coreTo]);

    const toWithoutOverlay = React.useCallback(<K extends RouteKey>(key: K, ...args: ArgsOf<K>) => {
        void coreTo(key, true, ...args);
    }, [coreTo]);

    const href = React.useCallback(<K extends RouteKey>(key: K, ...args: ArgsOf<K>): HrefObject =>
        cleanHref(pathFor(key)(...args)), []);

    return { to, toWithoutOverlay, href };
}

async function ensureTransientUiClosed() {
    // close modal first (if any), then drawer; kick both, then await
    const m = useModalStore.getState();
    const d = useDrawerStore.getState();

    const wantsModalClose = m.status !== 'closed';
    const wantsDrawerClose = d.status !== 'closed';

    if (wantsModalClose) m.closeModal();
    if (wantsDrawerClose) d.closeDrawer?.();

    await Promise.all([
        wantsModalClose ? useModalStore.getState().waitUntilClosed() : Promise.resolve(),
        wantsDrawerClose ? useDrawerStore.getState().waitUntilClosed() : Promise.resolve(),
    ]);
}


export function useCanonicalBackHandler(options?: { enabled?: boolean }) {
    const { enabled = true } = options ?? {};
    const navigation = useNavigation();

    useBackHandler(React.useCallback(() => {
        if (!enabled) return false;

        // 1) close modal if open
        const m = useModalStore.getState();
        if (m.status !== 'closed') { m.closeModal(); return true; }

        // 2) close drawer if open
        const d = useDrawerStore.getState();
        if (d.status !== 'closed') { d.closeDrawer?.(); return true; }

        // 3) go back in stack if possible
        if (navigation.canGoBack()) { navigation.goBack(); return true; }

        // 4) let OS handle (exit/minimize)
        return false;
    }, [enabled, navigation]));
}