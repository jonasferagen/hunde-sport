// useCanonicalNav.ts
import { cleanHref, RouteKey, routes } from '@/config/routes';
import { HrefObject, LinkProps, router, useLocalSearchParams, usePathname } from 'expo-router';
import * as React from 'react';

type ArgsOf<K extends RouteKey> =
    Parameters<(typeof routes)[K]['path']>;

const shallowEqualStrings = (a?: Record<string, any>, b?: Record<string, any>) => {
    const A = a ?? {}, B = b ?? {};
    const ak = Object.keys(A), bk = Object.keys(B);
    if (ak.length !== bk.length) return false;
    for (const k of ak) if (String(A[k]) !== String(B[k])) return false;
    return true;
};

export function useCanonicalNav() {
    const pathname = usePathname();
    const currentParams = useLocalSearchParams(); // strings only

    const to = React.useCallback(<K extends RouteKey>(
        key: K,
        ...args: ArgsOf<K>
    ) => {
        const route = routes[key];
        const href = cleanHref(route.path(...args));
        const sameScreen = href.pathname === pathname;

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
        const r = routes[key];
        const href = cleanHref(r.path(...args));
        return { href: href as HrefObject, replace: r.nav !== 'push' };
    }, []);

    const href = React.useCallback(<K extends RouteKey>(
        key: K,
        ...args: ArgsOf<K>
    ): HrefObject => cleanHref(routes[key].path(...args)), []);

    return { to, linkProps, href };
}
