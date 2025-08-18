// PageView.tsx
import { THEME_PAGE } from '@/config/app';
import { useFocusEffect } from '@react-navigation/native';
import React from 'react';
import { YStackProps } from 'tamagui';
import { ThemedYStack } from '../ui';
import { ThemedLinearGradient } from '../ui/themed-components/ThemedLinearGradient';
// Memoized backdrop so PageView re-renders don't recompute gradient math
const PageBackdrop = React.memo(function PageBackdrop({
  token = 'background',
}: { token?: string }) {
  return <ThemedLinearGradient token={token} />;
});

type PageViewProps = YStackProps & {
  withGradient?: boolean;
  gradientToken?: string;
};

import { useNavProgress } from '@/stores/navProgressStore';
import { useIsFocused } from '@react-navigation/native';

export const PageView = ({ children, withGradient = true, gradientToken = 'background', ...stackProps }: PageViewProps) => {
  const isFocused = useIsFocused();

  useFocusEffect(React.useCallback(() => {
    useNavProgress.getState().stop();
  }, []));


  return (
    <>
      <ThemedYStack
        theme={THEME_PAGE}
        f={1}
        gap="none"
        // if you still want it invisible and inert to touches while blurred:
        pointerEvents={isFocused ? 'auto' : 'none'}
        style={isFocused ? { opacity: 1 } : { opacity: 0.0001 }} // to keep layout
        {...stackProps}
      >
        {withGradient ? <PageBackdrop token={gradientToken} /> : null}
        {children}
      </ThemedYStack>


    </>
  );
};
