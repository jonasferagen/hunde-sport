import React, { ReactNode } from 'react';
import { H3, ScrollView, YStack, YStackProps } from 'tamagui';
import { ThemedLinearGradient } from '../ui/ThemedLinearGradient';

interface PageContentProps extends YStackProps {
  children: ReactNode;
  title?: string;
  scrollable?: boolean; // Add this prop
}

export const PageContent = (props: PageContentProps) => {

  const {
    children,
    title,
    theme = 'light',
    scrollable,
    ...stackProps

  } = props;

  const validChildren = React.Children.toArray(children).filter(Boolean);

  if (validChildren.length === 0) {
    return null;
  }

  return <YStack theme={theme} {...stackProps}>
    <ThemedLinearGradient />
    {title && <H3 p="$3" pb="none">{title}</H3>}
    <YStack
      p="$3"
      bbw={1}
      boc="$borderColor"

      {...stackProps}
    >
      {scrollable ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          {validChildren}
        </ScrollView>
      ) : (
        validChildren // Just render children directly
      )}
    </YStack >
  </YStack>
};
/*     <ScrollView
horizontal={horizontal}
showsHorizontalScrollIndicator={horizontal}
>
{validChildren}
</ScrollView> */