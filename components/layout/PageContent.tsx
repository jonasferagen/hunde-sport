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
    paddingVertical = '$3',
    paddingHorizontal = '$3',
    ...stackProps
  } = props;

  const validChildren = React.Children.toArray(children).filter(Boolean);

  if (validChildren.length === 0) {
    return null;
  }

  const content = (
    <>
      {title && (
        <>
          <H3>{title}</H3>
          <Spacer size="$3" />
        </>
      )}
      {horizontal ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {validChildren}
        </ScrollView>
      ) : (
        validChildren
      )}
    </>
  );

  return (
    <YStack
      theme={theme}
      paddingVertical={paddingVertical}
      paddingHorizontal={paddingHorizontal}
      borderWidth={1}
      borderColor="$borderColor"
      backgroundColor={secondary ? '$backgroundFocus' : '$background'}
      {...stackProps}
    >
      {content}
    </YStack>
  );
};
