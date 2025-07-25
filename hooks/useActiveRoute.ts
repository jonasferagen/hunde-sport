import { useSegments } from 'expo-router';

export const homeRoute = '/(drawer)/(tabs)/(home)';
export const cartRoute = '/(drawer)/(tabs)/shopping-cart';
export const searchRoute = '/(drawer)/(tabs)/search';

export const useActiveRoute = () => {
    const segments = useSegments() as string[];

    // The home screen's final segment is '(home)'
    const isHomeActive = segments[segments.length - 1] === '(home)';

    // The cart screen's final segment is 'shopping-cart'
    const isCartActive = segments[segments.length - 1] === 'shopping-cart';

    // The search screen's final segment is 'search'
    const isSearchActive = segments[segments.length - 1] === 'search';

    return { isHomeActive, isCartActive, isSearchActive };
};
