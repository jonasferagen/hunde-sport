// useCanonicalNav.ts
import { cleanHref, routes } from '@/config/routes';
import { HrefObject, LinkProps, router, useLocalSearchParams, usePathname } from 'expo-router';
import * as React from 'react';

type Routes = typeof routes;
type RouteKey = keyof Routes;
type ArgsOf<K extends RouteKey> =
    Routes[K] extends { path: (...a: infer A) => any } ? A : never;

function callPath<K extends RouteKey>(k: K, ...a: ArgsOf<K>) {
    return (routes[k].path as (...a: ArgsOf<K>) => HrefObject)(...a);
}

const stripTrailingSlash = (p?: string) => (p?.replace(/\/+$/, '') || '/');

const normalizeParams = (obj?: Record<string, unknown>) => {
    const entries = Object.entries(obj ?? {}).flatMap(([k, v]) => {
        if (v == null) return [];                         // drop null/undefined
        if (Array.isArray(v)) v = v[0];                   // expo-router sometimes gives string[]
        const s = String(v).trim();
        if (!s) return [];                                // drop empty strings
        return [[k, s] as const];
    });
    // sort for stable identity
    entries.sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
    return Object.fromEntries(entries);
};

const paramsKey = (obj?: Record<string, unknown>) => JSON.stringify(normalizeParams(obj));

export function useCanonicalNav() {
    const rawPathname = usePathname();
    const pathname = React.useMemo(() => stripTrailingSlash(rawPathname), [rawPathname]);

    const paramsObj = useLocalSearchParams();
    const currentParamsKey = React.useMemo(() => paramsKey(paramsObj as any), [paramsObj]);

    const to = React.useCallback(<K extends RouteKey>(key: K, ...args: ArgsOf<K>) => {
        const { nav, path } = routes[key];
        const href = cleanHref(callPath(key, ...args));
        const targetPath = stripTrailingSlash(href.pathname);

        if (targetPath === pathname) {
            if (nav === 'push') {
                router.push(href); // product -> product
            } else {
                // only update params if actually different
                const nextKey = paramsKey(href.params as any);
                if (nextKey && nextKey !== currentParamsKey) {
                    router.setParams(href.params as any);
                }
            }
            return;
        }

        if (nav === 'push') router.push(href);
        else if (nav === 'replace') router.replace(href);
        else router.navigate(href); // 'switch'
    }, [pathname, currentParamsKey]);

    const linkProps = React.useCallback(<K extends RouteKey>(
        key: K,
        ...args: ArgsOf<K>
    ): Pick<LinkProps, 'href' | 'replace'> => {
        const href = cleanHref(callPath(key, ...args));
        const replace = routes[key].nav !== 'push';
        return { href, replace };
    }, []);

    const href = React.useCallback(<K extends RouteKey>(
        key: K,
        ...args: ArgsOf<K>
    ): HrefObject => cleanHref(callPath(key, ...args)), []);

    return { to, linkProps, href };
}
