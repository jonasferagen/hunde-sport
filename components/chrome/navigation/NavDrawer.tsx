import { type DrawerContentComponentProps } from "@react-navigation/drawer";
import { X } from "@tamagui/lucide-icons";
import * as Application from "expo-application";
import React from "react";
import { H3 } from "tamagui";

import { Loader } from "@/components/ui/Loader";
import { ThemedLinearGradient, ThemedText, ThemedXStack, ThemedYStack } from "@/components/ui/themed";
import { ThemedButton } from "@/components/ui/themed/ThemedButton";
import { ProductCategoryTree } from "@/components/widgets/ProductCategoryTree";
import { THEME_SHEET_BG1, THEME_SHEET_BG2 } from "@/config/app";
import { useDrawerSettled } from "@/hooks/ui/useDrawerSettled";
import { resolveThemeToken } from "@/lib/theme";
import { useDrawerStore } from "@/stores/ui/drawerStore";

export const NavDrawer = ({ navigation }: { navigation: DrawerContentComponentProps["navigation"] }) => {
  useDrawerSettled();

  const installControls = useDrawerStore((s) => s.installControls);
  const clearControls = useDrawerStore((s) => s.clearControls);

  React.useEffect(() => {
    installControls(navigation as any);
    return clearControls;
  }, [installControls, clearControls, navigation]);

  return <NavDrawerContent />;
};

const NavDrawerContent = () => {
  const hasOpened = useDrawerStore((s) => s.hasOpened);
  const closeDrawer = useDrawerStore((s) => s.closeDrawer);
  const version = Application.nativeApplicationVersion ?? "?.?";
  const build = Application.nativeBuildVersion ?? "N/A";
  const c1 = resolveThemeToken(THEME_SHEET_BG1, "background");
  const c2 = resolveThemeToken(THEME_SHEET_BG2, "background");

  return (
    <ThemedYStack f={1} gap="$0">
      <ThemedXStack box container split theme={THEME_SHEET_BG1}>
        <H3>hunde-sport.no</H3>
        <ThemedButton circular onPress={closeDrawer}>
          <X />
        </ThemedButton>
      </ThemedXStack>
      <ThemedYStack f={1} mih={0}>
        <ThemedLinearGradient fromColor={c1} toColor={c2} alpha={1} />
        {hasOpened ? <ProductCategoryTree colors={[c1, c2]} /> : <Loader />}
      </ThemedYStack>
      <ThemedYStack box container jc="flex-end" theme={THEME_SHEET_BG2}>
        <ThemedText size="$1" ta="right">
          v{version} - (build {build})
        </ThemedText>
      </ThemedYStack>
    </ThemedYStack>
  );
};
