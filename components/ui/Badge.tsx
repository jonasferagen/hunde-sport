// components/ui/Badge.tsx
import React from "react";
import type { ThemeName } from "tamagui";

import { ThemedXStack, type ThemedXStackProps } from "@/components/ui/themed";

type Corner = "tl" | "tr" | "bl" | "br";

type BadgeBaseProps = ThemedXStackProps & {
  corner?: Corner; // where to pin (optional)
  offset?: number | string; // distance from edges (default $2)
  theme?: ThemeName; // theme for the badge surface
  children: React.ReactNode;
};

function BadgeBase({
  corner,
  offset = "$2",
  theme,
  children,
  ...props
}: BadgeBaseProps) {
  const pos: Partial<Record<Corner, Partial<ThemedXStackProps>>> = {
    tl: { t: offset, l: offset },
    tr: { t: offset, r: offset },
    bl: { b: offset, l: offset },
    br: { b: offset, r: offset },
  };

  return (
    <ThemedXStack
      theme={theme}
      pos={corner ? "absolute" : ((props.pos as any) ?? "relative")}
      {...(corner ? pos[corner] : {})}
      ai="center"
      jc="center"
      bg="$background"
      br="$3"
      pointerEvents="none" // decorative by default
      {...props}
    >
      {children}
    </ThemedXStack>
  );
}

interface TileBadgeProps extends ThemedXStackProps {
  corner?: Corner;
  offset?: number | string;
  theme?: ThemeName;
  children: React.ReactNode;
}

export const TileBadge = ({
  corner = "tr",
  offset = "$2",
  theme,
  children,
  ...props
}: TileBadgeProps) => {
  return (
    <BadgeBase
      corner={corner}
      offset={offset}
      theme={theme}
      p="$1"
      px="$2"
      gap="$2"
      br="$3"
      ov="hidden"
      {...props}
    >
      {children}
    </BadgeBase>
  );
};

interface IconBadgeProps extends ThemedXStackProps {
  offset?: number | string;
  theme?: ThemeName;
  children: React.ReactNode;
}

export const IconBadge = ({ theme, children, ...props }: IconBadgeProps) => {
  return (
    <BadgeBase
      theme={theme}
      corner="tr"
      offset="$-2.5" // tweak per icon size
      h="$1"
      miw="$1"
      p="$1"
      br={9999}
      {...props}
    >
      {children}
    </BadgeBase>
  );
};
