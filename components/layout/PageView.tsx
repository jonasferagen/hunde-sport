import { THEME_PAGE } from '@/config/app';
import { YStackProps } from 'tamagui';
import { ThemedLinearGradient, ThemedYStack } from '../ui';
export const PageView = ({ children, ...stackProps }: YStackProps) => {

  return (
    <ThemedYStack
      theme={THEME_PAGE}
      f={1}
      gap="none"

      {...stackProps}>
      <ThemedLinearGradient />
      {children}
    </ThemedYStack>
  );
}
