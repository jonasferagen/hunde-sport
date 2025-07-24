import { ThemeVariant } from '@/types';
import React, { ReactNode } from 'react';
import { ScrollView } from 'react-native';
import { H3, Spacer, YStack, YStackProps } from 'tamagui';

interface PageContentProps extends YStackProps {
  children: ReactNode;
  title?: string;
  theme?: ThemeVariant;
  horizontal?: boolean;
  secondary?: boolean;
}

export const PageContent = (props: PageContentProps) => {

  const {
    children,
    title,
    theme,
    horizontal,
    secondary,
    paddingVertical = '$4',
    paddingHorizontal = '$4',
    ...stackProps
  } = props;

  if (!children) {
    return null;
  }

  const content = (
    <>
      {title && (
        <>
          <H3 paddingHorizontal={paddingHorizontal}>{title}</H3>
          <Spacer size="$3" />
        </>
      )}
      {horizontal ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {children}
        </ScrollView>
      ) : (
        children
      )}
    </>
  );

  return (
    <YStack
      theme={theme}
      paddingVertical={paddingVertical}
      paddingHorizontal={title ? undefined : paddingHorizontal}
      borderWidth={1}
      borderColor="$borderColor"
      backgroundColor={secondary ? '$backgroundFocus' : '$background'}
      {...stackProps}
    >
      {content}
    </YStack>
  );
};
