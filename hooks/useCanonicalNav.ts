// useCanonicalNav.ts
import { cleanHref, RouteKey, routes } from '@/config/routes';
import { HrefObject, LinkProps, router, useLocalSearchParams, usePathname } from 'expo-router';
import * as React from 'react';


const navTimer = { label: '', t0: 0, target: '' as string };


const shallowEqualStrings = (a?: Record<string, any>, b?: Record<string, any>) => {
    const A = a ?? {}, B = b ?? {};
    const ak = Object.keys(A), bk = Object.keys(B);
    if (ak.length !== bk.length) return false;
    for (const k of ak) if (String(A[k]) !== String(B[k])) return false;
    return true;
};


type RouteMap = typeof routes;
type ArgsOf<K extends RouteKey> =
    RouteMap[K] extends { path: (...a: infer A) => any } ? A : never;

const getRoute = <K extends RouteKey>(k: K) => routes[k] as RouteMap[K];
const getPath = <K extends RouteKey>(k: K) =>
    getRoute(k).path as (...a: ArgsOf<K>) => HrefObject;

export function useCanonicalNav() {
    const pathname = usePathname();
    const currentParams = useLocalSearchParams(); // strings only
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

    const to = React.useCallback(<K extends RouteKey>(
        key: K,
        ...args: ArgsOf<K>
    ) => {




        const route = routes[key];
        const href = cleanHref(getPath(key)(...args));
        const sameScreen = href.pathname === pathname;

        // start timer
        navTimer.t0 = performance.now();
        navTimer.label = key as string;
        navTimer.target = href.pathname;


        if (sameScreen) {
            // same screen:
            if (route.nav === 'push') {
                // detail page navigating to another detail (e.g. product -> product)
                router.push(href);
            } else {
                // top-level: only update params if they changed
                const changed = !shallowEqualStrings(currentParams, href.params as any);
                if (changed) router.setParams((href.params ?? {}) as any);
            }
            return;
        }

        // different screen:
        if (route.nav === 'push') {
            router.push(href);
        } else if (route.nav === 'replace') {
            router.replace(href);
        } else {
            router.navigate(href);
        }
    }, [pathname, currentParams]);

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
