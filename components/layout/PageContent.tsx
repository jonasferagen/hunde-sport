import React, { ReactNode } from 'react';
import { H3, ScrollView, YStackProps } from 'tamagui';
import { ThemedLinearGradient } from '../ui/themed-components/ThemedLinearGradient';
import { ThemedYStack } from '../ui/themed-components/ThemedStack';

interface PageContentProps extends YStackProps {
  children: ReactNode;
  title?: string;
  scrollable?: boolean; // Add this prop
  px?: string;
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

  const px = stackProps.px === 'none' ? '$3' : 'none';

  return (

    <ThemedYStack preset="container" {...stackProps}>
      <ThemedLinearGradient />
      {title && <H3 px={px}>{title}</H3>}

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
