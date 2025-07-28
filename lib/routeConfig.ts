import { Home, Search, ShoppingCart } from '@tamagui/lucide-icons';
import { ThemeName } from 'tamagui';

type RouteConfig = {
    [key: string]: {
        label: string;
        icon: any; // Or more specific type if you have one
        theme: ThemeName;
    };
};

export const routeConfig: RouteConfig = {
    'index': {
        label: 'Hjem',
        icon: Home,
        theme: 'primary'
    },
    'search': {
        label: 'Produktsøk',
        icon: Search,
        theme: 'tertiary'
    },
    'shopping-cart': {
        label: 'Handlekurv',
        icon: ShoppingCart,
        theme: 'secondary'
    }
};