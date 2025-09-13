// PageSection.tsx
import React from "react";

import { ThemedYStack, type ThemedYStackProps } from "@/components/ui/themed";
import { ThemedHeading } from "@/components/ui/themed/ThemedHeading";

type PageSectionProps = ThemedYStackProps & {
  title?: string;
  fill?: boolean;
  padded?: boolean;
};

const SPACE = "$3";

export const PageSection: React.FC<PageSectionProps> = ({ title, children, fill = false, padded = false, ...stackProps }) => {
  const hasChildren = React.Children.toArray(children).some(Boolean);
  if (!hasChildren) return null;

  const py = padded || title ? SPACE : "none";
  const px = padded ? SPACE : "none";
  const mx = padded ? "none" : SPACE;

  return (
    <ThemedYStack box py={py} px={px} {...stackProps}>
      {title ? <ThemedHeading mx={mx}>{title}</ThemedHeading> : null}

      <ThemedYStack f={fill ? 1 : undefined} mih={fill ? 0 : undefined}>
        {children}
      </ThemedYStack>
    </ThemedYStack>
  );
};
