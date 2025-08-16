import React, { ReactNode } from 'react';
import { ScrollView, YStackProps } from 'tamagui';
import { ThemedText } from '../ui';
import { ThemedYStack } from '../ui/themed-components/ThemedStack';

interface PageSectionProps extends YStackProps {
  children: ReactNode;
  title?: string;
  scrollable?: boolean;
  px?: string;
}

export const PageSection = (props: PageSectionProps) => {

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
    <ThemedYStack
      box
      container
      {...stackProps}
    >

      {title && <ThemedText size="$6">{title}</ThemedText>}

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
