import { CheckoutScreen } from '@/screens/CheckoutScreen';
import { JSX } from 'react';

// This is now a modal screen, so it doesn't use the ScreenWrapper
// from the (app) layout, which includes the BottomBar.
export default (): JSX.Element => <CheckoutScreen />;
