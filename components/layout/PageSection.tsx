// PageSection.tsx
import React from 'react';
import { H4, YStackProps } from 'tamagui';

import { ThemedYStack } from '../ui/themed-components/ThemedStacks';



type PageSectionProps = YStackProps & {
  title?: string;
  fill?: boolean;                 // let children (e.g. FlashList) own height
};

export const PageSection: React.FC<PageSectionProps> = ({
  title,
  children,
  p = "none",
  fill = false,
  ...stackProps
}) => {

  const hasChildren = React.Children.toArray(children).some(Boolean);
  if (!hasChildren) return null;

  return (
    <ThemedYStack
      box
      py={title ? '$3' : 'none'}


      {...stackProps}
    >
      {title ? <H4 mx="$3">{title}</H4> : null}

      <ThemedYStack

        f={fill ? 1 : undefined}
        mih={fill ? 0 : undefined}
      >
        {children}
      </ThemedYStack>
    </ThemedYStack>
  );
};
