// useCanonicalNav.ts
import { cleanHref, routes, type NavPolicy } from '@/config/routes';
import { useNavigationProgress } from '@/stores/navigationProgressStore';
import { HrefObject, router, useLocalSearchParams, usePathname } from 'expo-router';
import * as React from 'react';
import { startTransition } from 'react';

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

export function useCanonicalNavigation() {
    const rawPathname = usePathname();
    const pathname = React.useMemo(() => stripTrailingSlash(rawPathname), [rawPathname]);

    const paramsObj = useLocalSearchParams();
    const currentParamsKey = React.useMemo(() => paramsKey(paramsObj as any), [paramsObj]);

    const coreTo = React.useCallback(<K extends RouteKey>(
        key: K,
        withoutOverlay: boolean,
        ...args: ArgsOf<K>
    ) => {
        const { nav } = routes[key];
        const href = cleanHref(pathFor(key)(...args));
        const targetPath = stripTrailingSlash(href.pathname);
        const policy: NavPolicy = nav;

        scheduleNav(() => {
            // same-path navigation => either push (stack) or just update params
            if (targetPath === pathname) {
                if (policy === 'push') {
                    router.push(href);
                } else {
                    const nextKey = paramsKey(href.params as any);
                    if (nextKey && nextKey !== currentParamsKey) {
                        router.setParams(href.params as any);
                    }
                }
                return;
            }

            // cross-path navigation
            if (policy === 'push') router.push(href);
            else if (policy === 'switch') router.navigate(href);
            else router.replace(href);
        }, withoutOverlay);
    }, [pathname, currentParamsKey]);

    // Public API
    const to = React.useCallback(<K extends RouteKey>(key: K, ...args: ArgsOf<K>) => {
        coreTo(key, false, ...args);
    }, [coreTo]);

    const toWithoutOverlay = React.useCallback(<K extends RouteKey>(key: K, ...args: ArgsOf<K>) => {
        coreTo(key, true, ...args);
    }, [coreTo]);

    const href = React.useCallback(<K extends RouteKey>(key: K, ...args: ArgsOf<K>): HrefObject =>
        cleanHref(pathFor(key)(...args)), []);

    return { to, toWithoutOverlay, href };
}
