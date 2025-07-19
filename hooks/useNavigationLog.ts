import { NavigationContainerRef } from '@react-navigation/native';
import { useEffect } from 'react';

export const useNavigationLog = (navigationRef: React.RefObject<NavigationContainerRef<{}>>) => {
    useEffect(() => {
        if (!__DEV__ || !navigationRef?.current) return;

        const formatRoutes = (routes: any[]): string => {
            return routes
                .map((route: any) => {
                    const params = route.params
                        ? Object.entries(route.params)
                            .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
                            .join(', ')
                        : '';
                    return `${route.name}${params ? ` [${params}]` : ''}`;
                })
                .join(' > ');
        };

        const findAndLogInnermostRoutes = (currentState: any): void => {
            if (!currentState?.routes || typeof currentState.index !== 'number') {
                return;
            }

            const activeRoute = currentState.routes[currentState.index];

            if (activeRoute?.state) {
                // This is a navigator, go deeper
                findAndLogInnermostRoutes(activeRoute.state);
            } else {
                // This is the innermost active screen, log its sibling routes
                console.log('Navigation:', formatRoutes(currentState.routes));
            }
        };

        const onStateChange = (state: any) => {
            findAndLogInnermostRoutes(state);
        };

        // The 'state' event is not directly available on the ref with Expo Router's setup.
        // We listen to the root state node instead.
        const unsubscribe = navigationRef.current.addListener('__unsafe_action__', (payload) => {
            const state = navigationRef.current?.getRootState();
            if (state) {
                onStateChange(state);
            }
        });

        return () => {
            unsubscribe();
        };
    }, [navigationRef]);
};
