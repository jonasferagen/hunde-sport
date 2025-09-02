import React from "react";
import { Theme, type YStackProps } from "tamagui";

import { ThemedText, ThemedYStack } from "@/components/ui/themed-components";
import { ThemedLinearGradient } from "@/components/ui/themed-components/ThemedLinearGradient";
import { THEME_PAGE_HEADER } from "@/config/app";

interface PageHeaderProps extends YStackProps {
  title?: string;
  children?: React.ReactNode;
  container?: boolean;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  children,
  ...props
}) => {
  return (
    <Theme name={THEME_PAGE_HEADER}>
      <ThemedYStack btw={0} gap="none" {...props}>
        <ThemedLinearGradient />
        {title && <ThemedText size="$4">{title}</ThemedText>}
        {children}
      </ThemedYStack>
    </Theme>
  );
};
