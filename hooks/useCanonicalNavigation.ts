// useCanonicalNav.ts
import { cleanHref, routes, type NavPolicy } from '@/config/routes';
import { useNavigationProgress } from '@/stores/navigationProgressStore';
import { HrefObject, LinkProps, router, useLocalSearchParams, usePathname } from 'expo-router';
import * as React from 'react';
import { startTransition } from 'react';

// --- types + helpers (keep your route typing) ---



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
    // sort keys for stable identity
    entries.sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
    return Object.fromEntries(entries);
};

const paramsKey = (obj?: Record<string, unknown>) => JSON.stringify(normalizeParams(obj));


// inside useCanonicalNav.ts
const scheduleNav = (fn: () => void, withoutOverlay: boolean) => {

    if (withoutOverlay) { startTransition(fn); return; }
    useNavigationProgress.getState().start();               // flip overlay now (no re-render)
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            // give overlay a paint
            setTimeout(() => {
                startTransition(fn); /** Note: hack still needed for the overlay to work */
            }, 1);
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

        // navigate action picker
        scheduleNav(() => {
            const policy: NavPolicy = nav;

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

    const linkProps = React.useCallback(<K extends RouteKey>(
        key: K,
        ...args: ArgsOf<K>
    ): Pick<LinkProps, 'href' | 'replace'> => {
        const href = cleanHref(pathFor(key)(...args));
        const replace = routes[key].nav !== 'push';
        return { href, replace };
    }, []);

    // Intercept press to show overlay before navigating
    const linkPropsWithoutOverlay = React.useCallback(<K extends RouteKey>(
        key: K,
        ...args: ArgsOf<K>
    ): Pick<LinkProps, 'href' | 'replace' | 'onPress'> => {
        const base = linkProps(key, ...args);
        return {
            ...base,
            onPress: (e) => {
                e?.preventDefault?.();
                toWithoutOverlay(key, ...args);
            },
        };
    }, [linkProps, toWithoutOverlay]);

    const href = React.useCallback(<K extends RouteKey>(key: K, ...args: ArgsOf<K>): HrefObject =>
        cleanHref(pathFor(key)(...args)), []);

    return { to, toWithoutOverlay, linkProps, linkPropsWithoutOverlay, href };
}
