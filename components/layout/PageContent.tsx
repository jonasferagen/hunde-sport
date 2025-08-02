import React, { ReactNode } from 'react';
import { ScrollView } from 'react-native';
import { H3, YStack, YStackProps } from 'tamagui';

interface PageContentProps extends YStackProps {
  children: ReactNode;
  title?: string;
  horizontal?: boolean;
}

export const PageContent = (props: PageContentProps) => {

  const {
    children,
    title,
    theme = 'light',
    horizontal,
    ...stackProps

  } = props;

  const validChildren = React.Children.toArray(children).filter(Boolean);

  if (validChildren.length === 0) {
    return null;
  }

  return <YStack theme={theme} {...stackProps}>
    {title && <H3 p="$3" pb="none">{title}</H3>}
    <YStack
      p="$3"
      bbw={1}
      boc="$borderColor"
      flexShrink={1}
      {...stackProps}
    >
      {!horizontal ? <ScrollView horizontal={horizontal} showsHorizontalScrollIndicator={horizontal}>{validChildren}</ScrollView> : validChildren}
    </YStack >
  </YStack>
};
//   <ThemedLinearGradient />