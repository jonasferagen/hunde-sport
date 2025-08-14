import { YStackProps } from 'tamagui';
import { ThemedLinearGradient, ThemedYStack } from '../ui';
export const PageView = ({ children, ...stackProps }: YStackProps) => {

  return (
    <ThemedYStack
      theme="neutral"
      f={1}
      gap="none"

      {...stackProps}>
      <ThemedLinearGradient />
      {children}
    </ThemedYStack>
  );
}
