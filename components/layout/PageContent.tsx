import React, { ReactNode } from 'react';
import { ScrollView } from 'react-native';
import { H3, Spacer, YStack, YStackProps } from 'tamagui';

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
      padding="$3"
      borderBottomWidth={1}
      backgroundColor={"$background"}
      borderColor={"$borderColor"}
      gap="$3"
      {...props}
    >
      {content}
    </YStack >
  );
};
