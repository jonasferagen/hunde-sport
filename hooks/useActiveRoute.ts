import { routes } from '@/config/routes';
import { useSegments } from 'expo-router';


export const homeRoute = routes.home();
export const cartRoute = routes.shoppingCart();
export const searchRoute = routes.search();

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
