// useCanonicalNav.ts
import { cleanHref, RouteKey, routes } from '@/config/routes';
import { HrefObject, LinkProps, router, useLocalSearchParams, usePathname } from 'expo-router';
import * as React from 'react';


type RouteMap = typeof routes;
type ArgsOf<K extends RouteKey> =
    RouteMap[K] extends { path: (...a: infer A) => any } ? A : never;

const getRoute = <K extends RouteKey>(k: K) => routes[k] as RouteMap[K];
const getPath = <K extends RouteKey>(k: K) =>
    getRoute(k).path as (...a: ArgsOf<K>) => HrefObject;


const normalizeParams = (obj?: Record<string, any>) =>
    Object.fromEntries(
        Object.entries(obj ?? {}).flatMap(([k, v]) => {
            if (v == null) return [];                              // drop null/undefined
            if (Array.isArray(v)) v = v[0];                        // expo-router can give string[]
            const s = String(v);
            if (s.trim() === '') return [];                        // drop empty strings to avoid {} vs {q:""}
            return [[k, s]];
        })
    );

const toJSON = (obj?: Record<string, any>) => JSON.stringify(normalizeParams(obj));

export function useCanonicalNav() {
    const rawPathname = usePathname();
    const pathname = React.useMemo(
        () => (rawPathname?.replace(/\/+$/, '') || '/'),
        [rawPathname]
    );

    const paramsObj = useLocalSearchParams();
    const currentKey = React.useMemo(() => toJSON(paramsObj as any), [paramsObj]);

    const to = React.useCallback(<K extends RouteKey>(key: K, ...args: ArgsOf<K>) => {
        const route = routes[key];
        const href = cleanHref(getPath(key)(...args));
        const targetPath = (href.pathname?.replace(/\/+$/, '') || '/');
        const sameScreen = targetPath === pathname;

        if (sameScreen) {
            console.log("same");
            if (route.nav === 'push') {
                router.push(href);               // product -> product, etc.
            } else {
                const nextKey = toJSON(href.params as any);
                if (nextKey && nextKey !== currentKey) {
                    router.setParams(href.params as any);
                }
            }
            return;
        }

        router.replace(href);
        /*
                if (route.nav === 'push') router.push(href);
                else if (route.nav === 'replace') router.replace(href);
                else router.navigate(href); */
    }, [pathname, currentKey]);


    const linkProps = React.useCallback(<K extends RouteKey>(
        key: K,
        ...args: ArgsOf<K>
    ): Pick<LinkProps, 'href' | 'replace'> => {
        const href = cleanHref(getPath(key)(...args));
        const { nav } = getRoute(key);
        return { href, replace: nav !== 'push' };
    }, []);

    const href = React.useCallback(<K extends RouteKey>(
        key: K,
        ...args: ArgsOf<K>
    ): HrefObject => cleanHref(getPath(key)(...args)), []);

    return { to, linkProps, href };
}
