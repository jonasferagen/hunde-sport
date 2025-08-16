import { PreloaderScreen } from '@/screens/PreloaderScreen';
import { JSX } from 'react';
// app/index.ts (or the earliest executed file)
import { enableFreeze } from 'react-native-screens';
enableFreeze(true);

const App = (): JSX.Element => {
    return <PreloaderScreen />;
};

export default App;