import { LinearGradient } from '@tamagui/linear-gradient';
import React, { ReactNode } from 'react';
import { ScrollView } from 'react-native';
import { H3, Stack, YStack, YStackProps } from 'tamagui';

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

  return <Stack theme={theme} {...stackProps}>
    <LinearGradient
      colors={["$background", "$backgroundPress"]}
      start={[0, 0]}
      end={[1, 1]}
      f={1}
    >
      {title && <H3 p="$3" pb="none">{title}</H3>}
      <YStack
        f={1}
        p="$3"
        bbw={1}
        boc="$borderColor"
        {...stackProps}
      >

        <ScrollView contentContainerStyle={{ flex: 1 }} horizontal={horizontal} showsHorizontalScrollIndicator={horizontal}>{validChildren}</ScrollView>
      </YStack >
    </LinearGradient>
  </Stack>
};
