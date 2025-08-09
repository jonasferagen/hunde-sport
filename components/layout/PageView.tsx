import { YStack, YStackProps } from 'tamagui';
export const PageView = ({ children, ...stackProps }: YStackProps) =>

  <YStack f={1} {...stackProps}>
    {children}
  </YStack>
