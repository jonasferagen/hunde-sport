import React, { ReactNode } from 'react';
import { H3, ScrollView, YStackProps } from 'tamagui';
import { ThemedLinearGradient } from '../ui/themed-components/ThemedLinearGradient';
import { ThemedYStack } from '../ui/themed-components/ThemedStack';

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
    <ThemedYStack preset="container" {...stackProps}>
      <ThemedLinearGradient />
      {title && <H3 px="$3">{title}</H3>}

      {scrollable ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          {validChildren}
        </ScrollView>
      ) : (
        validChildren // Just render children directly
      )}

    </ThemedYStack >
  );
};
