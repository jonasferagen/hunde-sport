import "src/bootstrap";
import "expo-router/entry";
import "react-native-gesture-handler";
import "react-native-reanimated";

import * as SplashScreen from "expo-splash-screen";
SplashScreen.preventAutoHideAsync().catch(() => {}); // <- runs once
// ...rest of your layout
