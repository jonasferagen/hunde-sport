// NavHeader.tsx
import { Menu } from "@tamagui/lucide-icons";
import { Theme } from "tamagui";

import {
  ThemedButton,
  ThemedLinearGradient,
  ThemedXStack,
} from "@/components/ui/themed";
import { ThemedHeading } from "@/components/ui/themed/ThemedHeading";
import { THEME_HEADER } from "@/config/app";
import { useHeaderTitle } from "@/config/routes";
import { useDrawerStore } from "@/stores/ui/drawerStore";

export const NavHeader = () => {
  const openDrawer = useDrawerStore((s) => s.openDrawer);
  const title = useHeaderTitle();

  return (
    <Theme name={THEME_HEADER}>
      <ThemedXStack container split box>
        <ThemedLinearGradient />
        <ThemedXStack f={1} miw={0} h="100%" ai="center">
          <ThemedHeading
            size="$7"
            mih={0}
            f={1}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {title}
          </ThemedHeading>
        </ThemedXStack>
        <ThemedButton circular disabled={!openDrawer} onPress={openDrawer}>
          <Menu />
        </ThemedButton>
      </ThemedXStack>
    </Theme>
  );
};
