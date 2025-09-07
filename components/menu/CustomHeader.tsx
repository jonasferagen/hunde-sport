// CustomHeader.tsx
import { Menu } from "@tamagui/lucide-icons";
import { H3, Theme } from "tamagui";

import {
  ThemedButton,
  ThemedLinearGradient,
  ThemedXStack,
} from "@/components/ui/themed-components";
import { THEME_HEADER } from "@/config/app";
import { useHeaderTitle } from "@/config/routes";
import { useDrawerStore } from "@/stores/ui/drawerStore";

export const CustomHeader = () => {
  const openDrawer = useDrawerStore((s) => s.openDrawer);
  const title = useHeaderTitle();

  return (
    <Theme name={THEME_HEADER}>
      <ThemedXStack container split box>
        <ThemedLinearGradient />
        <H3 f={1}>{title}</H3>
        <ThemedButton
          f={0}
          circular
          disabled={!openDrawer}
          onPress={openDrawer}
        >
          <Menu />
        </ThemedButton>
      </ThemedXStack>
    </Theme>
  );
};
