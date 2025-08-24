import { Redirect } from 'expo-router';

export default function Root() {
    // always go to preloader first
    return <Redirect href="/(preloader)" />;
}
