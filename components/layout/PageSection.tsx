// PageSection.tsx
import React from "react";
import { H4, type YStackProps } from "tamagui";

import { ThemedYStack } from "@/components/ui/themed-components";

type PageSectionProps = YStackProps & {
  title?: string;
  fill?: boolean;
  padded?: boolean;
};

const SPACE = "$3";

export const PageSection: React.FC<PageSectionProps> = ({
  title,
  children,
  fill = false,
  padded = false,
  ...stackProps
}) => {
  const hasChildren = React.Children.toArray(children).some(Boolean);
  if (!hasChildren) return null;

  const py = padded || title ? SPACE : "none";
  const px = padded ? SPACE : "none";
  const mx = padded ? "none" : SPACE;

  return (
    <ThemedYStack box py={py} px={px} {...stackProps}>
      {title ? <H4 mx={mx}>{title}</H4> : null}

      <ThemedYStack f={fill ? 1 : undefined} mih={fill ? 0 : undefined}>
        {children}
      </ThemedYStack>
    </ThemedYStack>
  );
};
