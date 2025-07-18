import { Redirect } from 'expo-router';

export default function ShoppingCartRedirect() {
    return <Redirect href="/(drawer)/(tabs)/(home)/shoppingCart" />;
}
