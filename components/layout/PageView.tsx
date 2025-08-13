import { YStack, YStackProps } from 'tamagui';
export const PageView = ({ children, ...stackProps }: YStackProps) =>

  <YStack bbw={1} f={1} {...stackProps}>
    {children}
  </YStack>
