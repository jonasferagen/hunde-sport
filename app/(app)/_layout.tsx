// app/(app)/_layout.tsx
import type {
  DrawerContentComponentProps,
  DrawerNavigationOptions,
} from "@react-navigation/drawer";
import { View } from "tamagui";

import { NavDrawer } from "@/components/chrome/navigation/NavDrawer";
import { NavHeader } from "@/components/chrome/navigation/NavHeader";
import { ThemedYStack } from "@/components/ui/themed";

// ----- Hoisted renderers (stable, no closure over AppLayout) -----------------
function renderDrawerContent(props: DrawerContentComponentProps) {
  return <NavDrawer navigation={props.navigation} />;
}

const renderHeader: NonNullable<DrawerNavigationOptions["header"]> = () => (
  <NavHeader />
);

// Stable options object
const SCREEN_OPTIONS: DrawerNavigationOptions = {
  header: renderHeader,
  swipeEnabled: true,
  freezeOnBlur: true,
  lazy: false,
} as const;

const AppLayout = () => {
  return (
    <View f={1} pos="relative" zi={10}>
      <ThemedYStack pos="absolute" fullscreen bg="$background"></ThemedYStack>
    </View>
  );
};

export default AppLayout;
