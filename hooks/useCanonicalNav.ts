// useCanonicalNav.ts
import { cleanHref, RouteKey, routes } from '@/config/routes';
import { HrefObject, LinkProps, router, useLocalSearchParams, usePathname } from 'expo-router';
import * as React from 'react';

const navTimer = { label: '', t0: 0, target: '' as string };

type RouteMap = typeof routes;
type ArgsOf<K extends RouteKey> =
    RouteMap[K] extends { path: (...a: infer A) => any } ? A : never;

const getRoute = <K extends RouteKey>(k: K) => routes[k] as RouteMap[K];
const getPath = <K extends RouteKey>(k: K) =>
    getRoute(k).path as (...a: ArgsOf<K>) => HrefObject;

const toJSON = (obj?: Record<string, any>) =>
    JSON.stringify(Object.fromEntries(Object.entries(obj ?? {}).filter(([, v]) => v != null)));

let lastParamsSig = '';
let sameSetCount = 0;
let lastSetAt = 0;
function warnIfLoop(sig: string) {
    const now = Date.now();
    if (sig === lastParamsSig && now - lastSetAt < 1000) {
        sameSetCount++;
        if (sameSetCount >= 3) {
            console.warn('[NAV] Possible setParams loop; same params 3x in <1s:', sig);
        }
    } else {
        sameSetCount = 0;
        lastParamsSig = sig;
    }
    lastSetAt = now;
}

export function useCanonicalNav() {
    const rawPathname = usePathname();
    const pathname = React.useMemo(
        () => (rawPathname?.replace(/\/+$/, '') || '/'),
        [rawPathname]
    );

    // Expo Router returns strings (and sometimes string[]) – we only care about a stable signature
    const currentParams = useLocalSearchParams();
    const currentKey = React.useMemo(() => toJSON(currentParams as any), [currentParams]);

    React.useEffect(() => {
        if (!navTimer.t0) return;
        if (pathname === navTimer.target) {
            const dt = Math.round(performance.now() - navTimer.t0);
            console.log(`[NAV] ${navTimer.label} -> ${navTimer.target} in ${dt}ms`);
            navTimer.t0 = 0;
            navTimer.label = '';
            navTimer.target = '';
        }
    }, [pathname]);

    const to = React.useCallback(<K extends RouteKey>(key: K, ...args: ArgsOf<K>) => {
        const route = routes[key];
        const href = cleanHref(getPath(key)(...args));
        const targetPath = (href.pathname?.replace(/\/+$/, '') || '/');
        const sameScreen = targetPath === pathname;

        // start timer (per nav intent)
        navTimer.t0 = performance.now();
        navTimer.label = key as string;
        navTimer.target = targetPath;

        if (sameScreen) {
            if (route.nav === 'push') {
                // same route, new detail – push a new entry (e.g., product -> product)
                router.push(href);
            } else {
                // top-level: only update URL params if they actually changed and aren’t empty
                const nextKey = toJSON(href.params as any);
                if (nextKey && nextKey !== currentKey) {
                    warnIfLoop(nextKey);
                    router.setParams(href.params as any);
                }
            }
            return;
        }

        // different screen
        if (route.nav === 'push') router.push(href);
        else if (route.nav === 'replace') router.replace(href);
        else router.navigate(href);
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
