// app/(app)/_layout.tsx
import { type DrawerContentComponentProps } from "@react-navigation/drawer";
import Drawer from "expo-router/drawer";
import React from "react";
import { View } from "tamagui";

import { CustomDrawer } from "@/components/menu/CustomDrawer";
import { CustomHeader } from "@/components/menu/CustomHeader";
import { ThemedYStack } from "@/components/ui";
import { LoadingOverlay } from "@/screens/misc/LoadingOverlay";

const AppLayout = () => {
  //const isOpen = useDrawerStore((s) => s.status !== 'closed');

  const drawerContent = React.useCallback(
    (props: DrawerContentComponentProps) => (
      <CustomDrawer navigation={props.navigation} />
    ),
    []
  );

  const screenOptions = React.useMemo(
    () => ({
      header: () => <CustomHeader />,
      swipeEnabled: true,
      freezeOnBlur: true, // default
      unmountOnBlur: false, // default
      lazy: false,
    }),
    []
  );

  return (
    <View f={1} pos="relative" zi={10}>
      <ThemedYStack pos="absolute" fullscreen bg="$background">
        <Drawer
          drawerContent={drawerContent}
          screenOptions={screenOptions}
          detachInactiveScreens={false}
          initialRouteName="(shop)"
        >
          <Drawer.Screen
            name="(shop)"
            options={{ sceneStyle: { backgroundColor: "transparent" } }}
          />
        </Drawer>
        <LoadingOverlay zi={99} />
      </ThemedYStack>
    </View>
  );
};

export default AppLayout;
