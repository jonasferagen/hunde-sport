import React, { ReactNode } from 'react';
import { H3, ScrollView, YStackProps } from 'tamagui';
import { ThemedLinearGradient } from '../ui/ThemedLinearGradient';
import { ThemedYStack } from '../ui/ThemedStack';

interface PageContentProps extends YStackProps {
  children: ReactNode;
  title?: string;
  scrollable?: boolean; // Add this prop
}

export const PageContent = (props: PageContentProps) => {

  const {
    children,
    title,
    scrollable,
    ...stackProps

  } = props;

  const validChildren = React.Children.toArray(children).filter(Boolean);

  if (validChildren.length === 0) {
    return null;
  }

  return (
    <ThemedYStack {...stackProps}>
      <ThemedLinearGradient />
      {title && <H3 p="$3" pb="none">{title}</H3>}
      <ThemedYStack
        p="$3"
        bbw={1}
        {...stackProps}
      >
        {scrollable ? (
          <ScrollView showsVerticalScrollIndicator={false}>
            {validChildren}
          </ScrollView>
        ) : (
          validChildren // Just render children directly
        )}

      </ThemedYStack >
    </ThemedYStack >
  );
};
